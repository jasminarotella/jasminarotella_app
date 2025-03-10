from config.database import db

class Agente(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Identificativo unico
    email = db.Column(db.String(100), unique=True, nullable=False)  # Email
    password = db.Column(db.String(100), nullable=False)  # Password criptata
