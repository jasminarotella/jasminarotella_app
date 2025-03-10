import { Link } from "react-router-dom";

const AgenteDiCommercio: React.FC = () => {
    //registrazione ok
    //login ok
    //modifica password agente autorizzato
    //inserisci zona agente autorizzato
    //verifica coppia agenteid e zona in tzone
    //se presente dice che è gia presente
    //se non è presente 
    //aggiunto record in tzona con agente id e cap
    //chiamata a wepapi esterna con il cap
    //per quel cap estrae i posti e li aggiunge in tplaces abbinati a zona e afente
    //visualizza zone agente autorizzato ok
    //visualizza places di una zona di un agente autorizzato
    //cliccando su un pulsante si apre la mappa su google map e coordinate
    //eliminazione un singolo place di una zona di un agente
    //eliminazione tutti i place di una zona di un agente
    //eliminazione di una zona di un agente
    return (
        <div>
            <h1>Agente di Commercio - Home</h1>
            <div className="istruzioni">
                <ul>Flusso Logico delle Chiamate Api</ul>
                <li>//registrazione </li>
                <li>//login</li>
                <li>//modifica password agente autorizzato</li>
                <li>//inserisci zona agente autorizzato</li>
                <li>//verifica coppia agenteid e zona in tzone</li>
                <li>//se presente dice che è gia presente</li>
                <li>//se non è presente </li>
                <li>//aggiunto record in tzona con agente id e cap</li>
                <li>//chiamata a wepapi esterna con il cap</li>
                <li>//per quel cap estrae i posti e li aggiunge in tplaces abbinati a zona e afente</li>
                <li>//visualizza zone agente autorizzato</li>
                <li>//visualizza places di una zona di un agente autorizzato
                </li>
                <li>//cliccando su un pulsante si apre la mappa su google map e coordinate
                </li>
                <li>//eliminazione un singolo place di una zona di un agente</li>
                <li>//eliminazione tutti i place di una zona di un agente
                </li>
                <li>//eliminazione di una zona di un agente
                </li>
            </div>
            <h3>1. Base per l'interfaccia grafica</h3>
            <li>Creo tutti i Componenti Necessari</li>
            <li>Creo Il Router di Navigazione</li>
            <Link to="/homeagente">Vai al Login </Link>
            <h3>Lavoro su una api alla volta e la collego alla pagina</h3>
            <li>Creo le Tabelle con dati fittizi in ognuna cosi da poter visualizzare i dati</li>
            <p>
                1. creo
                Tabella agenti:
                id, mail, password
                <code>
                    class Agente(db.Model):
                    id = db.Column(db.Integer, primary_key=True)
                    email = db.Column(db.String(100), unique=True, nullable=False)
                    password = db.Column(db.String(100), nullable=False)
                </code>
            </p>
            <li>Creazione del database e del punto di avvio dell'app</li>
            <code>
                run.py
                from config.database import app, db
                from routes.agenti import agenti_bp

                # Registra le API
                app.register_blueprint(agenti_bp)

                # Creiamo il database all'avvio
                with app.app_context():
                db.create_all()

                if __name__ == "__main__":
                app.run(debug=True)
            </code>
            <li>Per comodità tengo separate config, routes, models in diverse cartelle</li>
            <li>Connessione al db di sqlalchemy e della rotta home</li>
            <code>
                database.py
                from flask import Flask
                from flask_sqlalchemy import SQLAlchemy

                app = Flask(__name__)
                @app.route("/")
                def home():
                return "Il server Flask funziona! 🎉"


                # Configuriamo SQLite
                app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///agenti.db"
                app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

                db = SQLAlchemy(app)

            </code>
            <li>Creo il modello agente per la registrazione</li>
            <code>
                from config.database import db

                class Agente(db.Model):
                id = db.Column(db.Integer, primary_key=True)  # Identificativo unico
                email = db.Column(db.String(100), unique=True, nullable=False)  # Email
                password = db.Column(db.String(100), nullable=False)  # Password criptata

            </code>
            <li>Creo le rotte per Registrare, verificare il token e accedere con esso</li>
            <code>
                from flask import Blueprint, request, jsonify
                from config.database import db, app
                from models.agente import Agente
                from werkzeug.security import generate_password_hash, check_password_hash
                import jwt
                import datetime

                agenti_bp = Blueprint("agenti", __name__)

                # 🔹 API per registrare un agente
                @agenti_bp.route("/register", methods=["POST"])
                def register():
                data = request.json
                email = data.get("email")
                password = data.get("password")

                # 🔐 Cripta la password
                hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

                # 🛑 Controlla se l'email esiste già
                if Agente.query.filter_by(email=email).first():
                return jsonify("message": "Agente già registrato!"), 400

                # ✅ Salva il nuovo agente nel database
                new_agent = Agente(email=email, password=hashed_password)
                db.session.add(new_agent)
                db.session.commit()

                # 🎟️ Genera un token valido per 10 minuti
                token = jwt.encode(
                "email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
                "chiave_segreta",
                algorithm="HS256"
                )

                return jsonify("message": "Registrazione riuscita!", "token": token), 201


                # 🔐 Funzione per verificare il token
                def token_required(f):
                def decorator(*args, **kwargs):
                token = request.headers.get("x-access-token")
                if not token:
                return jsonify("message": "Token mancante!"), 401
                try:
                data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
                agente = Agente.query.filter_by(email=data["email"]).first()
                except:
                return jsonify("message": "Token non valido o scaduto!"), 401
                return f(agente, *args, **kwargs)
                return decorator


                # 🕵️‍♂️ API per accedere al profilo
                @agenti_bp.route("/profile", methods=["GET"])
                @token_required
                def profile(agente):
                return jsonify("id": agente.id, "email": agente.email)
            </code>
            <div>
                <h3>Cosa succede in pratica? Proviamo le api in postman</h3>
                <li>CON POST E url http://127.0.0.1:5000/register</li>
                <li>nel body inserisco </li>
                <code>
                    "email": "jasmina.ciao@gmail.com",
                    "password": "ciao1234"
                </code>
                <li>Risposta: un token </li>
                <li>Inserire il token in headers con "x-access-token"</li>
                <li>CON GET e url http://127.0.0.1:5000/user</li>
            </div>
        </div>
    )
};
export default AgenteDiCommercio  