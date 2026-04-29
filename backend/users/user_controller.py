# backend/users/user_controller.py
from flask import Blueprint, request, jsonify
from tickets.backend.users.user_service import create_user_service, get_user_service

# Criação do Blueprint para o controlador de usuários
user_controller = Blueprint('user_controller', __name__)

# Rota para criar um novo usuário
@user_controller.route('/users', methods=['POST'])
def create_user():
    user_data = request.get_json()
    create_user_service(user_data)
    return jsonify({"message": "Usuário criado com sucesso!"}), 201

# Rota para obter informações de um usuário
@user_controller.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = get_user_service(user_id)
    if user:
        return jsonify(dict(user)), 200
    return jsonify({"message": "Usuário não encontrado"}), 404