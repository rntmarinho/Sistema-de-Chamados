from flask import Blueprint, request, jsonify
from categories.category_model import get_all_categories, create_category, delete_category

category_controller = Blueprint('category_controller', __name__)

@category_controller.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = get_all_categories()
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_controller.route('/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    if not data or 'nome' not in data:
        return jsonify({"message": "O nome da categoria é obrigatório"}), 400
    try:
        create_category(data['nome'])
        return jsonify({"message": "Sucesso"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@category_controller.route('/categories/<int:cat_id>', methods=['DELETE'])
def delete_category_route(cat_id):
    try:
        delete_category(cat_id)
        return jsonify({"message": "Categoria excluída"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500