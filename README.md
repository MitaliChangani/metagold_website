# MetaGold – Deployable Overlay (Wallet + Razorpay + Render)

This overlay adds a production-like **wallet API** with **Razorpay** and a **Render blueprint** that serves your existing frontend from `my-project/build`.

**Date:** 2025-08-14

## Files
- `gold_app/app.py` — Flask app, Razorpay order + verify, wallet endpoints, serves SPA
- `gold_app/db.py` — SQLite DB
- `gold_app/requirements.txt`
- `.env.example` — keys to set in Render
- `render.yaml` — single-service deploy

## Deploy (Render)
1. Copy these into your repo (root). Keep your existing `my-project` folder.
2. On Render → New → Blueprint → repo → Deploy.
3. In Render service → Environment:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Test endpoints:
   - `/api/health`
   - `POST /api/users` → `{"name":"Test","phone":"99999"}`
   - `/api/create_order` → `{"amount": 100}`

## Local
```bash
cd my-project && npm install && npm run build && cd ..
pip install -r gold_app/requirements.txt
export PORT=10000
python -m gold_app.app
```