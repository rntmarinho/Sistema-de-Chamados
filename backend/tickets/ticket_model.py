# backend/tickets/ticket_model.py
from database.conect_database import get_db_connection
import sqlite3


def create_ticket(ticket):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Adicionado usuario_id no INSERT
    cursor.execute("""
        INSERT INTO tbl_tickets (assunto, descricao, prioridade, status, categoria, usuario_id)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        ticket['assunto'], 
        ticket['descricao'], 
        ticket['prioridade'], 
        ticket.get('status', 'aberto'), 
        ticket['categoria'],
        ticket['usuario_id'] # Recebido do payload do frontend
    ))
    conn.commit()
    conn.close()

def get_all_tickets():
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    # Realiza um JOIN para trazer o nome do solicitante junto com os dados do ticket
    cursor.execute("""
        SELECT t.*, u.nome as solicitante_nome 
        FROM tbl_tickets t
        LEFT JOIN tbl_users u ON t.usuario_id = u.id
        ORDER BY t.data_criacao DESC
    """)
    tickets = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return tickets

# Função para obter um ticket por ID
def get_ticket_by_id(ticket_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tbl_tickets WHERE id = ?", (ticket_id,))
    ticket = cursor.fetchone()
    conn.close()
    return ticket

# Função para atualizar um ticket
def update_ticket(ticket_id, updates):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE tbl_tickets SET assunto = ?, descricao = ?, prioridade = ?, status = ?, categoria = ?
        WHERE id = ?
    """, (updates['assunto'], updates['descricao'], updates['prioridade'], updates['status'], updates['categoria'], ticket_id))
    conn.commit()
    conn.close()

# Função para deletar um ticket
def delete_ticket(ticket_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tbl_tickets WHERE id = ?", (ticket_id,))
    conn.commit()
    conn.close()

def update_ticket(ticket_id, data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE tbl_tickets 
        SET assunto = ?, descricao = ?, prioridade = ?, status = ?, categoria = ?, usuario_id = ?
        WHERE id = ?
    """, (data['assunto'], data['descricao'], data['prioridade'], 
          data['status'], data['categoria'], data['usuario_id'], ticket_id))
    conn.commit()
    conn.close()