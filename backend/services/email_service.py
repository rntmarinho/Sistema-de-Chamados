import time
import logging
from imap_tools import MailBox, AND
# Importação da função de serviço do seu projeto
from tickets.ticket_service import create_ticket_service 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def processar_emails_imap():
    """Conecta ao servidor e converte e-mails não lidos em tickets."""
    # Credenciais estáticas conforme sua configuração
    HOST = "imap.consominas.com.br"
    PORT = 993
    USER = "suporte.ti@consominas.com.br"
    PASSWORD = "Sup$26!cns"

    try:
        logging.info(f"Iniciando varredura IMAP em {HOST}...")
        with MailBox(HOST, port=PORT).login(USER, PASSWORD) as mailbox:
            # Busca apenas e-mails não lidos
            for msg in mailbox.fetch(AND(seen=False)):
                logging.info(f"Processando e-mail de: {msg.from_} - Assunto: {msg.subject}")
                
                # Mapeamento exato para evitar KeyError no ticket_model
                ticket_data = {
                    "solicitante": msg.from_,
                    "assunto": msg.subject,
                    "descricao": msg.text or msg.html or "Sem conteúdo no corpo do e-mail.",
                    "categoria": "E-mail Corporativo",
                    "prioridade": "Média",
                    "usuario_id": 1
                }
                
                # Persistência via lógica de negócio do sistema
                create_ticket_service(ticket_data)
                logging.info(f"Ticket criado com sucesso no banco de dados.")
                
    except Exception as e:
        logging.error(f"Erro no serviço de e-mail: {e}")

def iniciar_daemon_email():
    """Loop de execução do serviço em background a cada 5 minutos."""
    while True:
        processar_emails_imap()
        time.sleep(100)