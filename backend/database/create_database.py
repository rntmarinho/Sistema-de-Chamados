import os
import sqlite3

# Caminho base (diretório onde o script está)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Caminho para a pasta database fora de backend
DB_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "database"))

# Garante que a pasta existe
os.makedirs(DB_DIR, exist_ok=True)

# Caminho completo do banco
DB_PATH = os.path.join(DB_DIR, "Chamados.db")

def create_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Criar tabela de tickets
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tbl_tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assunto TEXT NOT NULL,
            descricao TEXT,
            prioridade TEXT,
            status TEXT,
            categoria TEXT,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Criar tabela de usuários
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tbl_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            nome TEXT NOT NULL,
            solicitante TEXT CHECK(solicitante IN ('sim', 'nao')) NOT NULL
        );
    """)

    conn.commit()
    conn.close()
    print(f"Banco de dados criado com sucesso em: {DB_PATH}")

if __name__ == "__main__":
    create_database()