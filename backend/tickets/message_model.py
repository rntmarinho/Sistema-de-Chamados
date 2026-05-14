# backend/tickets/message_model.py
from database.conect_database import get_db_connection
import sqlite3


def get_messages_by_ticket(ticket_id: int) -> list[dict]:
    """Retorna todas as mensagens de um chamado, da mais antiga para a mais nova."""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, ticket_id, origem_id, autor, conteudo, criado_em
        FROM   tbl_ticket_messages
        WHERE  ticket_id = ?
        ORDER  BY criado_em ASC
        """,
        (ticket_id,),
    )
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def create_message(ticket_id: int, autor: str, conteudo: str, origem_id: int | None = None) -> int:
    """Insere uma mensagem e retorna o id gerado."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO tbl_ticket_messages (ticket_id, origem_id, autor, conteudo)
        VALUES (?, ?, ?, ?)
        """,
        (ticket_id, origem_id, autor, conteudo),
    )
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_id