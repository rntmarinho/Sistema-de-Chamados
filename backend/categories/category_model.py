# backend/categories/category_model.py
from database.conect_database import get_db_connection

def get_all_categories():
    conn = get_db_connection()
    categories = conn.execute("SELECT * FROM tbl_categorias").fetchall()
    conn.close()
    return [dict(cat) for cat in categories]

def create_category(nome):
    conn = get_db_connection()
    conn.execute("INSERT INTO tbl_categorias (nome) VALUES (?)", (nome,))
    conn.commit()
    conn.close()

def delete_category(cat_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM tbl_categorias WHERE id = ?", (cat_id,))
    conn.commit()
    conn.close()