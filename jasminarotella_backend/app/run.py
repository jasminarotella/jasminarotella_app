import os
from flask import send_from_directory
from flask_cors import CORS
from config.database import create_app  # Importa la funzione create_app
from routes.agenti import agenti_bp
from routes.zona import zona_bp

# Crea l'app Flask
app = create_app()

# Abilita CORS per il frontend React
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Registra le API
app.register_blueprint(agenti_bp)
app.register_blueprint(zona_bp)

# Serve il frontend React
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve il frontend React dalla cartella static."""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# Avvia l'app solo se eseguita direttamente
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Usa la porta assegnata da Render
    app.run(host="0.0.0.0", port=port, debug=True)
