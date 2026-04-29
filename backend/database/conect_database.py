# backend/database/db.py
import sqlite3
import os

# Caminho para o banco de dados
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'database', 'Chamados.db')

def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # Para retornar resultados como dicionários
    return conn