import os
from flask import send_from_directory
from flask_cors import CORS
from config.database import create_app, db
from routes.agenti import agenti_bp
from routes.zona import zona_bp

# Crea l'app Flask
app = create_app()

# Abilita CORS
CORS(app)  # Permette richieste da qualsiasi origine (puoi restringerlo se vuoi)


# Registra le API
app.register_blueprint(agenti_bp)
app.register_blueprint(zona_bp)




# Serve il frontend React
@app.route("/", defaults={"path": ""})
def serve_frontend(path):
    """Serve il frontend React dalla cartella static."""
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# Creazione del database all'avvio
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))  # Usa la porta assegnata da Render
app.run(host="0.0.0.0", port=port)
