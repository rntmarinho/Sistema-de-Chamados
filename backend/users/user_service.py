from users.user_model import create_user, get_user_by_id, get_all_users, update_user, delete_user

# Função para criar um novo usuário
def create_user_service(user_data):
    """
    Cria um novo usuário no banco de dados.
    :param user_data: dicionário com dados do usuário.
    """
    create_user(user_data)

# Função para obter todos os usuários
def get_all_users_service():
    """
    Retorna todos os usuários cadastrados.
    """
    return get_all_users()

# Função para obter um usuário específico por ID
def get_user_service(user_id):
    """
    Retorna um usuário específico com base no seu ID.
    :param user_id: ID do usuário.
    """
    return get_user_by_id(user_id)

# Função para atualizar um usuário
def update_user_service(user_id, updates):
    """
    Atualiza os dados de um usuário com base no ID.
    :param user_id: ID do usuário.
    :param updates: dicionário com os dados a serem atualizados.
    """
    update_user(user_id, updates)

# Função para excluir um usuário
def delete_user_service(user_id):
    """
    Exclui um usuário com base no ID.
    :param user_id: ID do usuário.
    """
    delete_user(user_id)