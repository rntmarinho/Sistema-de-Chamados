from flask import Blueprint, request, jsonify
from database.conect_database import get_db_connection

category_controller = Blueprint('category_controller', __name__)

@category_controller.route('/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    categories = conn.execute("SELECT * FROM tbl_categories").fetchall()
    conn.close()
    return jsonify([dict(cat) for cat in categories])

@category_controller.route('/categories', methods=['POST'])
def add_category():
    data = request.get_json()
    conn = get_db_connection()
    conn.execute("INSERT INTO tbl_categories (nome) VALUES (?)", (data['nome'],))
    conn.commit()
    conn.close()
    return jsonify({"message": "Sucesso"}), 201