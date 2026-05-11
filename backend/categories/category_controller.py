# backend/categories/category_controller.py
from flask import Blueprint, request, jsonify
from categories.category_model import get_all_categories, create_category, delete_category

category_controller = Blueprint('category_controller', __name__)

@category_controller.route('/categories', methods=['GET'])
def list_categories():
    return jsonify(get_all_categories()), 200

@category_controller.route('/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    create_category(data['nome'])
    return jsonify({"message": "Categoria criada!"}), 201

@category_controller.route('/categories/<int:id>', methods=['DELETE'])
def remove_category(id):
    delete_category(id)
    return jsonify({"message": "Categoria removida!"}), 200