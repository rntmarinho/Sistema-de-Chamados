# backend/tickets/message_controller.py
from flask import Blueprint, request, jsonify
from tickets.message_model import get_messages_by_ticket, create_message
from tickets.ticket_model import get_ticket_by_id, delete_ticket

message_controller = Blueprint("message_controller", __name__)


# ── GET /api/tickets/<id>/messages ────────────────────────────────────────────
@message_controller.route("/tickets/<int:ticket_id>/messages", methods=["GET"])
def list_messages(ticket_id):
    """Retorna todas as mensagens vinculadas a um chamado."""
    try:
        messages = get_messages_by_ticket(ticket_id)
        return jsonify(messages), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── POST /api/tickets/<id>/messages ───────────────────────────────────────────
@message_controller.route("/tickets/<int:ticket_id>/messages", methods=["POST"])
def add_message(ticket_id):
    """Adiciona uma mensagem manual a um chamado."""
    data = request.get_json()
    autor   = data.get("autor", "Sistema")
    conteudo = data.get("conteudo", "").strip()

    if not conteudo:
        return jsonify({"message": "Conteúdo da mensagem é obrigatório"}), 400

    try:
        msg_id = create_message(ticket_id, autor, conteudo)
        return jsonify({"message": "Mensagem adicionada", "id": msg_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── POST /api/tickets/<id>/merge ──────────────────────────────────────────────
@message_controller.route("/tickets/<int:pai_id>/merge", methods=["POST"])
def merge_ticket(pai_id):
    """
    Funde o chamado 'filho_id' dentro do chamado 'pai_id'.

    Corpo JSON esperado:
        { "filho_id": <int> }

    O que acontece:
        1. Valida que ambos os chamados existem e são diferentes.
        2. Cria uma mensagem no chamado pai com os dados do filho.
        3. Exclui o chamado filho.
    """
    data = request.get_json()
    filho_id = data.get("filho_id")

    if not filho_id:
        return jsonify({"message": "filho_id é obrigatório"}), 400

    if pai_id == filho_id:
        return jsonify({"message": "Um chamado não pode ser fundido consigo mesmo"}), 400

    try:
        pai   = get_ticket_by_id(pai_id)
        filho = get_ticket_by_id(filho_id)

        if not pai:
            return jsonify({"message": f"Chamado pai #{pai_id} não encontrado"}), 404
        if not filho:
            return jsonify({"message": f"Chamado filho #{filho_id} não encontrado"}), 404

        pai   = dict(pai)
        filho = dict(filho)

        # Monta o conteúdo da mensagem gerada automaticamente
        conteudo = (
            f"🔗 Chamado #{filho_id} fundido neste chamado.\n\n"
            f"**Assunto original:** {filho['assunto']}\n\n"
            f"**Descrição original:**\n{filho.get('descricao', '(sem descrição)')}\n\n"
            f"**Prioridade:** {filho.get('prioridade', '—')}  |  "
            f"**Status:** {filho.get('status', '—')}"
        )

        create_message(
            ticket_id=pai_id,
            autor="Sistema",
            conteudo=conteudo,
            origem_id=filho_id,
        )

        # Remove o chamado filho
        delete_ticket(filho_id)

        return jsonify({"message": f"Chamado #{filho_id} fundido com sucesso no #{pai_id}"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500