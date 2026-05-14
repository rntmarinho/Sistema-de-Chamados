# backend/tickets/ticket_model.py
from database.conect_database import get_db_connection
import sqlite3

def create_ticket(ticket):

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
        ticket['categoria'],
        ticket['usuario_id']
    ))
    conn.commit()
    conn.close()

def get_all_tickets():
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            t.*, 
            c.nome as categoria_nome,
            u.nome as solicitante_nome
        FROM tbl_tickets t
        LEFT JOIN tbl_categorias c ON t.categoria = c.id_categoria
        LEFT JOIN tbl_users u ON t.usuario_id = u.id
        ORDER BY t.data_criacao DESC
    """)
    tickets = cursor.fetchall()
    conn.close()
    return [dict(t) for t in tickets]
    
def get_ticket_by_id(ticket_id):
    """Recupera um ticket específico com JOIN para trazer nomes de categoria/usuário."""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    # CORREÇÃO: Adicionado JOIN para que o TicketDetails receba 'categoria_nome' e 'solicitante_nome'
    cursor.execute("""
        SELECT 
            t.*, 
            c.nome as categoria_nome,
            u.nome as solicitante_nome
        FROM tbl_tickets t
        LEFT JOIN tbl_categorias c ON t.categoria = c.id_categoria
        LEFT JOIN tbl_users u ON t.usuario_id = u.id
        WHERE t.id = ?
    """, (ticket_id,))
    ticket = cursor.fetchone()
    conn.close()
    return dict(ticket) if ticket else None

def update_ticket(ticket_id, data):
    """Atualiza os dados do chamado usando os nomes de coluna corretos."""
    conn = get_db_connection()
    cursor = conn.cursor()
    # CORREÇÃO: SET id_categoria = ? (em vez de categoria)
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
        data.get('categoria'), 
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