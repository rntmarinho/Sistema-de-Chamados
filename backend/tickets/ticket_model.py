# backend/tickets/ticket_model.py
from database.conect_database import get_db_connection
import sqlite3

def create_ticket(ticket):
    """Insere um novo chamado utilizando 'id_categoria' do payload."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tbl_tickets (assunto, descricao, prioridade, status, categoria, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        ticket['assunto'], 
        ticket['descricao'], 
        ticket['prioridade'], 
        ticket.get('status', 'aberto'), 
        ticket['id_categoria'],
        ticket['usuario_id']
    ))
    conn.commit()
    conn.close()

def get_all_tickets():
    """Retorna todos os tickets com nomes de solicitantes e categorias via JOIN."""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            t.*, 
            u.nome AS solicitante_nome, 
            c.nome AS categoria_nome 
        FROM tbl_tickets t
        LEFT JOIN tbl_users u ON t.usuario_id = u.id
        LEFT JOIN tbl_categorias c ON t.categoria = c.id
        ORDER BY t.data_criacao DESC
    """)
    tickets = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return tickets

def get_ticket_by_id(ticket_id):
    """Recupera um ticket específico pelo ID."""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tbl_tickets WHERE id = ?", (ticket_id,))
    ticket = cursor.fetchone()
    conn.close()
    return ticket

def update_ticket(ticket_id, data):
    """
    Atualiza os dados de um chamado.
    Mapeia explicitamente 'id_categoria' do frontend para a coluna 'categoria'.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE tbl_tickets 
        SET assunto = ?, 
            descricao = ?, 
            prioridade = ?, 
            status = ?, 
            categoria = ?, 
            usuario_id = ?
        WHERE id = ?
    """, (
        data['assunto'], 
        data['descricao'], 
        data['prioridade'], 
        data['status'], 
        data.get('id_categoria'), 
        data['usuario_id'], 
        ticket_id
    ))
    conn.commit()
    conn.close()

def delete_ticket(ticket_id):
    """Exclui permanentemente um chamado."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tbl_tickets WHERE id = ?", (ticket_id,))
    conn.commit()
    conn.close()