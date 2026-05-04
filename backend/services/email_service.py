import time
import logging
import os
from dotenv import load_dotenv
from imap_tools import MailBox, AND
from tickets.ticket_service import create_ticket_service 

# Carrega as variáveis do ficheiro .env
load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def processar_emails_imap():
    """Conecta ao servidor e converte e-mails não lidos em tickets."""
    # Recupera as credenciais das variáveis de ambiente
    HOST = os.getenv("EMAIL_HOST")
    PORT = int(os.getenv("EMAIL_PORT", 993))
    USER = os.getenv("EMAIL_USER")
    PASSWORD = os.getenv("EMAIL_PASSWORD")

    try:
        logging.info(f"Iniciando varredura IMAP em {HOST}...")
        with MailBox(HOST, port=PORT).login(USER, PASSWORD) as mailbox:
            for msg in mailbox.fetch(AND(seen=False)):
                logging.info(f"Processando e-mail de: {msg.from_} - Assunto: {msg.subject}")
                
                ticket_data = {
                    "solicitante": msg.from_,
                    "assunto": msg.subject,
                    "descricao": msg.text or msg.html or "Sem conteúdo no corpo do e-mail.",
                    "categoria": "E-mail Corporativo",
                    "prioridade": "Média",
                    "usuario_id": 1
                }
                
                create_ticket_service(ticket_data)
                logging.info(f"Ticket criado com sucesso no banco de dados.")
                
    except Exception as e:
        logging.error(f"Erro no serviço de e-mail: {e}")

def iniciar_daemon_email():
    """Loop de execução do serviço em background a cada 100 segundos."""
    while True:
        processar_emails_imap()
        time.sleep(100)