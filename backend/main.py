# backend/app.py
from flask import Flask
from tickets.backend.tickets.ticket_controller import ticket_controller
from tickets.backend.users.user_controller import user_controller

app = Flask(__name__)

# Registrando os Blueprints (controladores)
app.register_blueprint(ticket_controller, url_prefix='/api')
app.register_blueprint(user_controller, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)