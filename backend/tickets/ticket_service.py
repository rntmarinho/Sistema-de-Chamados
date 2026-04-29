# backend/tickets/ticket_service.py
from tickets.backend.tickets.ticket_model import create_ticket, get_all_tickets, get_ticket_by_id, update_ticket, delete_ticket

# Lógica para criar um ticket
def create_ticket_service(ticket_data):
    create_ticket(ticket_data)

# Lógica para obter todos os tickets
def get_all_tickets_service():
    return get_all_tickets()

# Lógica para obter um ticket específico
def get_ticket_service(ticket_id):
    return get_ticket_by_id(ticket_id)

# Lógica para atualizar um ticket
def update_ticket_service(ticket_id, updates):
    update_ticket(ticket_id, updates)

# Lógica para excluir um ticket
def delete_ticket_service(ticket_id):
    delete_ticket(ticket_id)