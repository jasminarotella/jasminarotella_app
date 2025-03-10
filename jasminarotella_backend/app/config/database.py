from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Inizializza il database
db = SQLAlchemy()

def create_app():
    """Crea e configura l'app Flask"""
    app = Flask(__name__, static_folder="static", static_url_path="/")

    # Configurazione database
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inizializza il database con l'app
    db.init_app(app)

    # Creazione del database all'avvio
    with app.app_context():
        db.create_all()

    return app
