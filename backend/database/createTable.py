"""
Execute este script UMA VEZ para adicionar a tabela de mensagens ao banco.
Rodar de dentro da pasta backend/:
    python database/migrate_add_messages.py
"""

import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "database", "Chamados.db"))

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Tabela de mensagens vinculadas a um ticket pai
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tbl_ticket_messages (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id   INTEGER NOT NULL REFERENCES tbl_tickets(id) ON DELETE CASCADE,
            origem_id   INTEGER,                -- ID do chamado que foi fundido (opcional, para rastreio)
            autor       TEXT NOT NULL,          -- nome do usuário ou "Sistema"
            conteudo    TEXT NOT NULL,
            criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    conn.commit()
    conn.close()
    print(f"Migração concluída. Banco: {DB_PATH}")

if __name__ == "__main__":
    migrate()