import os, json
from typing import Optional
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import razorpay

from .db import init_db, create_user, get_user, list_users, get_balance, add_txn, list_txns

APP_DIR = os.path.dirname(__file__)
FRONT_BUILD = os.path.abspath(os.path.join(APP_DIR, "..", "my-project", "build"))

app = Flask(__name__, static_folder=FRONT_BUILD, static_url_path="/")
CORS(app)

# --- Initialize DB on startup ---
init_db()

# --- Razorpay client ---
RP_KEY = os.environ.get("RAZORPAY_KEY_ID")
RP_SECRET = os.environ.get("RAZORPAY_KEY_SECRET")
if not (RP_KEY and RP_SECRET):
    print("[WARN] RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET not set. /api/create_order will fail until set in Render env.")
razorpay_client = razorpay.Client(auth=(RP_KEY, RP_SECRET)) if (RP_KEY and RP_SECRET) else None

# -------- Frontend (React build) --------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    # Serve static assets if they exist, else fallback to index.html for SPA routes
    if FRONT_BUILD and os.path.isdir(FRONT_BUILD):
        full_path = os.path.join(FRONT_BUILD, path)
        if path and os.path.exists(full_path):
            return send_from_directory(FRONT_BUILD, path)
        index_html = os.path.join(FRONT_BUILD, "index.html")
        if os.path.exists(index_html):
            return send_from_directory(FRONT_BUILD, "index.html")
    return jsonify({"status": "ok", "message": "Frontend build not found. Ensure my-project/build exists."}), 200

# -------- Health --------
@app.route("/api/health")
def health():
    return jsonify({"status":"ok"})

# -------- Users --------
@app.route("/api/users", methods=["POST"])
def api_create_user():
    data = request.get_json(force=True) or {}
    name = data.get("name")
    phone = data.get("phone")
    if not name:
        return jsonify({"error":"name is required"}), 400
    try:
        uid = create_user(name, phone)
        return jsonify({"id": uid, "name": name, "phone": phone})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/users", methods=["GET"])
def api_list_users():
    rows = list_users(limit=int(request.args.get("limit", 100)))
    users = [{"id": r[0], "name": r[1], "phone": r[2], "created_at": r[3]} for r in rows]
    return jsonify(users)

# -------- Wallet --------
@app.route("/api/wallet/<int:uid>", methods=["GET"])
def api_get_wallet(uid: int):
    if not get_user(uid):
        return jsonify({"error":"user not found"}), 404
    balance_cents = get_balance(uid)
    return jsonify({"user_id": uid, "balance": balance_cents/100.0})

@app.route("/api/wallet/deposit", methods=["POST"])
def api_deposit():
    data = request.get_json(force=True) or {}
    uid = int(data.get("user_id", 0))
    amount = float(data.get("amount", 0))
    ref = data.get("reference")
    if amount <= 0:
        return jsonify({"error":"amount must be > 0"}), 400
    if not get_user(uid):
        return jsonify({"error":"user not found"}), 404
    add_txn(uid, "DEPOSIT", int(round(amount*100)), ref, None)
    return jsonify({"ok": True, "balance": get_balance(uid)/100.0})

@app.route("/api/wallet/withdraw", methods=["POST"])
def api_withdraw():
    data = request.get_json(force=True) or {}
    uid = int(data.get("user_id", 0))
    amount = float(data.get("amount", 0))
    ref = data.get("reference")
    if amount <= 0:
        return jsonify({"error":"amount must be > 0"}), 400
    if not get_user(uid):
        return jsonify({"error":"user not found"}), 404
    bal = get_balance(uid)
    cents = int(round(amount*100))
    if bal < cents:
        return jsonify({"error":"insufficient balance"}), 400
    add_txn(uid, "WITHDRAW", -cents, ref, None)
    return jsonify({"ok": True, "balance": get_balance(uid)/100.0})

@app.route("/api/wallet/transactions", methods=["GET"])
def api_list_transactions():
    uid = request.args.get("user_id")
    uid = int(uid) if uid else None
    rows = list_txns(uid=uid, limit=int(request.args.get("limit", 200)))
    txns = [{
        "id": r[0], "user_id": r[1], "type": r[2],
        "amount": r[3]/100.0, "reference": r[4], "meta": r[5],
        "created_at": r[6]
    } for r in rows]
    return jsonify(txns)

# -------- Razorpay --------
@app.route("/api/create_order", methods=["POST"])
def create_order():
    if not razorpay_client:
        return jsonify({"error":"Razorpay keys missing in environment"}), 500
    data = request.get_json(force=True) or {}
    amount = float(data.get("amount", 0))
    currency = data.get("currency", "INR")
    receipt = data.get("receipt", f"rcpt_{os.urandom(4).hex()}")
    if amount <= 0:
        return jsonify({"error":"amount must be > 0"}), 400
    order = razorpay_client.order.create({
        "amount": int(round(amount*100)),  # paise
        "currency": currency,
        "receipt": receipt,
        "payment_capture": 1
    })
    return jsonify(order)

@app.route("/api/payment_verify", methods=["POST"])
def payment_verify():
    if not razorpay_client:
        return jsonify({"error":"Razorpay keys missing in environment"}), 500
    data = request.get_json(force=True) or {}
    order_id = data.get("razorpay_order_id")
    payment_id = data.get("razorpay_payment_id")
    signature = data.get("razorpay_signature")
    try:
        razorpay.utility.verify_payment_signature({
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature
        })
        # For demo: credit wallet when payment verified
        uid = int(data.get("user_id", 0))
        amount = float(data.get("amount", 0))
        if uid and amount > 0 and get_user(uid):
            add_txn(uid, "PAYMENT", int(round(amount*100)), f"rzp:{payment_id}", json.dumps({"order_id": order_id}))
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)