# backend/users/user_model.py
from database.conect_database import get_db_connection

# Função para criar um novo usuário
def create_user(user_data):
    """
    Cria um novo usuário no banco de dados.
    :param user_data: dicionário contendo os dados do usuário (usuario, senha, nome, solicitante)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tbl_users (usuario, senha, nome, solicitante)
        VALUES (?, ?, ?, ?)
    """, (user_data['usuario'], user_data['senha'], user_data['nome'], user_data['solicitante']))
    conn.commit()
    conn.close()

# Função para obter todos os usuários
def get_all_users():
    """
    Retorna todos os usuários do banco de dados.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tbl_users")
    users = cursor.fetchall()
    conn.close()
    return users

# Função para obter um usuário específico por ID
def get_user_by_id(user_id):
    """
    Retorna um usuário específico com base no seu ID.
    :param user_id: ID do usuário.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tbl_users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    conn.close()
    return user

# Função para atualizar os dados de um usuário
def update_user(user_id, updates):
    """
    Atualiza os dados de um usuário existente no banco de dados.
    :param user_id: ID do usuário a ser atualizado.
    :param updates: dicionário com os novos dados (usuario, senha, nome, solicitante).
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE tbl_users
        SET usuario = ?, senha = ?, nome = ?, solicitante = ?
        WHERE id = ?
    """, (updates['usuario'], updates['senha'], updates['nome'], updates['solicitante'], user_id))
    conn.commit()
    conn.close()

# Função para excluir um usuário
def delete_user(user_id):
    """
    Exclui um usuário com base no ID.
    :param user_id: ID do usuário a ser excluído.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tbl_users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()