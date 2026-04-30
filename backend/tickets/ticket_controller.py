# backend/tickets/ticket_controller.py
from flask import Blueprint, request, jsonify
from tickets.ticket_service import create_ticket_service, get_all_tickets_service, get_ticket_service, update_ticket_service, delete_ticket_service

# Criação do Blueprint para o controlador de tickets
ticket_controller = Blueprint('ticket_controller', __name__)

# Rota para criar um novo ticket
@ticket_controller.route('/tickets', methods=['POST'])
def create_ticket():
    ticket_data = request.get_json()
    create_ticket_service(ticket_data)
    return jsonify({"message": "Ticket criado com sucesso!"}), 201

# Rota para obter todos os tickets
@ticket_controller.route('/tickets', methods=['GET'])
def get_all_tickets():
    tickets = get_all_tickets_service()
    return jsonify([dict(ticket) for ticket in tickets]), 200

# Rota para obter um ticket específico
@ticket_controller.route('/tickets/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    ticket = get_ticket_service(ticket_id)
    if ticket:
        return jsonify(dict(ticket)), 200
    return jsonify({"message": "Ticket não encontrado"}), 404

# Rota para atualizar um ticket
@ticket_controller.route('/tickets/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    updates = request.get_json()
    update_ticket_service(ticket_id, updates)
    return jsonify({"message": "Ticket atualizado com sucesso!"}), 200

# Rota para excluir um ticket
@ticket_controller.route('/tickets/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    delete_ticket_service(ticket_id)
    return jsonify({"message": "Ticket excluído com sucesso!"}), 200