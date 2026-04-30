# backend/users/user_controller.py
from flask import Blueprint, request, jsonify
from users.user_service import create_user_service, get_all_users_service, get_user_service
from users.user_model import verify_user

# Criação do Blueprint para o controlador de usuários
user_controller = Blueprint('user_controller', __name__)

# Rota para criar um novo usuário
@user_controller.route('/users', methods=['POST'])
def create_user():
    user_data = request.get_json()
    create_user_service(user_data)
    return jsonify({"message": "Usuário criado com sucesso!"}), 201

@user_controller.route('/users', methods=['GET'])
def get_all_users():
    users = get_all_users_service()
    # Converte cada linha do banco (Row) em um dicionário para o JSON
    return jsonify([dict(user) for user in users]), 200

# Rota para obter informações de um usuário
@user_controller.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = get_user_service(user_id)
    if user:
        return jsonify(dict(user)), 200
    return jsonify({"message": "Usuário não encontrado"}), 404

@user_controller.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = data.get('usuario')
    senha = data.get('senha')

    user = verify_user(usuario, senha)

    if user:
        # VERIFICAÇÃO: Se for solicitante ('sim'), bloqueia o acesso
        if user['solicitante'] == 'sim':
            return jsonify({
                "message": "Acesso negado: Apenas técnicos podem acessar o sistema."
            }), 403 # Erro 403: Proibido
        
        return jsonify({
            "message": "Login realizado com sucesso",
            "user": {
                "id": user['id'],
                "nome": user['nome'],
                "solicitante": user['solicitante']
            }
        }), 200
    else:
        return jsonify({"message": "Usuário ou senha incorretos"}), 401