import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(__file__).parent / "wallet.db"

SCHEMA = """
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
    user_id INTEGER PRIMARY KEY,
    balance_cents INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('DEPOSIT','WITHDRAW','ADJUST','PAYMENT')),
    amount_cents INTEGER NOT NULL,
    reference TEXT,
    meta JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
"""

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(SCHEMA)

@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

def create_user(name: str, phone: str|None):
    with get_conn() as c:
        cur = c.execute("INSERT INTO users(name, phone) VALUES(?, ?)", (name, phone))
        uid = cur.lastrowid
        c.execute("INSERT INTO wallets(user_id, balance_cents) VALUES(?, 0)", (uid,))
        return uid

def get_user(uid: int):
    with get_conn() as c:
        u = c.execute("SELECT id, name, phone, created_at FROM users WHERE id=?", (uid,)).fetchone()
        return u

def list_users(limit=100):
    with get_conn() as c:
        return c.execute("SELECT id, name, phone, created_at FROM users ORDER BY id DESC LIMIT ?", (limit,)).fetchall()

def get_balance(uid: int) -> int:
    with get_conn() as c:
        row = c.execute("SELECT balance_cents FROM wallets WHERE user_id=?", (uid,)).fetchone()
        return int(row[0]) if row else 0

def add_txn(uid: int, ttype: str, amount_cents: int, reference: str|None, meta: str|None):
    with get_conn() as c:
        c.execute("INSERT INTO transactions(user_id, type, amount_cents, reference, meta) VALUES(?,?,?,?,?)",
                  (uid, ttype, amount_cents, reference, meta))
        if ttype in ("DEPOSIT","PAYMENT","ADJUST") and amount_cents >= 0:
            c.execute("UPDATE wallets SET balance_cents = balance_cents + ? WHERE user_id=?", (amount_cents, uid))
        elif ttype in ("WITHDRAW","PAYMENT") and amount_cents < 0:
            c.execute("UPDATE wallets SET balance_cents = balance_cents + ? WHERE user_id=?", (amount_cents, uid))

def list_txns(uid: int|None=None, limit=200):
    with get_conn() as c:
        if uid:
            return c.execute("""
                SELECT id, user_id, type, amount_cents, reference, meta, created_at
                FROM transactions WHERE user_id=? ORDER BY id DESC LIMIT ?
            """, (uid, limit)).fetchall()
        return c.execute("""
            SELECT id, user_id, type, amount_cents, reference, meta, created_at
            FROM transactions ORDER BY id DESC LIMIT ?
        """, (limit,)).fetchall()