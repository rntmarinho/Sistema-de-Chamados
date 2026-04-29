# backend/tickets/ticket_model.py
from tickets.backend.database.conect_database import get_db_connection

# Função para criar um novo ticket
def create_ticket(ticket):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tbl_tickets (assunto, descricao, prioridade, status, categoria)
        VALUES (?, ?, ?, ?, ?)
    """, (ticket['assunto'], ticket['descricao'], ticket['prioridade'], ticket['status'], ticket['categoria']))
    conn.commit()
    conn.close()

# Função para obter todos os tickets
def get_all_tickets():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tbl_tickets")
    tickets = cursor.fetchall()
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