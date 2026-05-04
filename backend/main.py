import threading
from flask import Flask
from tickets.ticket_controller import ticket_controller
from users.user_controller import user_controller
# Importa a função de background do novo serviço[cite: 1]
from services.email_service import iniciar_daemon_email
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Registrando os Blueprints (controladores)[cite: 1]
app.register_blueprint(ticket_controller, url_prefix='/api')
app.register_blueprint(user_controller, url_prefix='/api')

load_dotenv()

if __name__ == '__main__':
   port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
    email_thread = threading.Thread(target=iniciar_daemon_email, daemon=True)
    email_thread.start()
    
    print("-> Serviço de integração IMAP iniciado em background.")
    
    # 2. Inicia o servidor Flask[cite: 1]
    app.run(debug=True)
