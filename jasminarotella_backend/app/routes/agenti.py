from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from config.database import db
from models.agente import Agente
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime


agenti_bp = Blueprint("agenti", __name__)

# API per registrare un agente
@agenti_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # 🔐 Cripta la password
    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

    # 🛑 Controlla se l'email esiste già
    if Agente.query.filter_by(email=email).first():
        return jsonify({"message": "Agente già registrato!"}), 400

    # ✅ Salva il nuovo agente nel database
    new_agent = Agente(email=email, password=hashed_password)
    db.session.add(new_agent)
    db.session.commit()

    # 🎟️ Genera un token valido per 10 minuti
    token = jwt.encode(
        {"email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)},
        "chiave_segreta",
        algorithm="HS256"
    )

    return jsonify({"message": "Registrazione riuscita!", "token": token}), 201


#  Funzione per verificare il token
def token_required(f):
    def decorator(*args, **kwargs):
        token = request.headers.get("x-access-token")
        if not token:
            return jsonify({"message": "Token mancante!"}), 401
        try:
            data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
            agente = Agente.query.filter_by(email=data["email"]).first()
        except:
            return jsonify({"message": "Token non valido o scaduto!"}), 401
        return f(agente, *args, **kwargs)
    return decorator


@agenti_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Controlla se l'utente esiste
    agente = Agente.query.filter_by(email=email).first()
    if not agente or not check_password_hash(agente.password, password):
        return jsonify({"message": "Credenziali errate!"}), 401

    # Genera un token valido per 10 minuti
    token = jwt.encode(
        {"email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)},
        "chiave_segreta",
        algorithm="HS256"
    )

    return jsonify({"message": "Login riuscito!", "token": token})


#  API per accedere al profilo
@agenti_bp.route("/profile", methods=["GET"])
@token_required
def profile(agente):
    return jsonify({"id": agente.id, "email": agente.email})

@agenti_bp.route("/change-password", methods=["PUT"])
def change_password():
    # Ottieni il token dall'header
    token = request.headers.get("x-access-token")
    if not token:
        return jsonify({"message": "Token mancante!"}), 401

    try:
        # Decodifica il token
        data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
        email = data["email"]

        # Trova l'agente nel database
        agente = Agente.query.filter_by(email=email).first()
        if not agente:
            return jsonify({"message": "Agente non trovato!"}), 404

        # Ottieni la nuova password dal corpo della richiesta
        data = request.json
        new_password = data.get("new_password")

        if not new_password:
            return jsonify({"message": "Nuova password richiesta!"}), 400

        # Cripta la nuova password e salva nel database
        agente.password = generate_password_hash(new_password, method="pbkdf2:sha256")
        db.session.commit()

        return jsonify({"message": "Password aggiornata con successo!"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token non valido!"}), 401
