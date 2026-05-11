# backend/database/conect_database.py
import os
import sqlite3

def get_db_connection():
    # Define o caminho absoluto para a pasta 'database' na raiz do projeto
    db_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '..', '..', 'database', 'Chamados.db'
    )
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn