# backend/database/db.py

import os
import psycopg2
import psycopg2.extras

def get_db_connection():
    database_url = os.getenv("postgresql://postgres:UXVOHUVgbhbTNwvUYxMGttuZQZSOiwBG@postgres.railway.internal:5432/railway")

    # Se existir DATABASE_URL → usa PostgreSQL (Railway)
    if database_url:
        conn = psycopg2.connect(
            database_url,
            sslmode="require"
        )
        return conn

    # Senão → fallback para SQLite (local)
    import sqlite3
    db_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '..', '..', 'database', 'Chamados.db'
    )
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
