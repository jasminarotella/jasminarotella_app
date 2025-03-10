from flask_cors import cross_origin
import requests
from flask import Blueprint, request, jsonify
from config.database import db
from models.zona import Zona, Place
from models.agente import Agente
import jwt

zona_bp = Blueprint("zona", __name__)

# API per aggiungere una nuova zona
@zona_bp.route("/add-zone", methods=["POST"])
def add_zone():
    # Verifica il Token
    token = request.headers.get("x-access-token")
    if not token:
        return jsonify({"message": "Token mancante!"}), 401

    try:
        data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
        email = data["email"]

        # Trova l'agente nel database
        agente = Agente.query.filter_by(email=email).first()
        if not agente:
            return jsonify({"message": "Agente non trovato!"}), 404

        agente_id = agente.id
        cap = request.json.get("cap")

        # 4.1. Controlla se la coppia AgenteID-Cap esiste già in TZone
        zona_esistente = Zona.query.filter_by(agente_id=agente_id, cap=cap).first()
        if zona_esistente:
            return jsonify({"message": "Zona già presente!"}), 400

        # 4.2.1. Inserisce la nuova zona in TZone
        nuova_zona = Zona(agente_id=agente_id, cap=cap)
        db.session.add(nuova_zona)
        db.session.commit()

        # 4.2.2. Chiama l'API esterna per ottenere i PlaceName
        url_api = f"https://api.zippopotam.us/it/{cap}"
        response = requests.get(url_api)

        if response.status_code == 200:
            dati = response.json()
            for place in dati.get("places", []):
                place_name = place.get("place name")
                longitude = place.get("longitude")
                latitude = place.get("latitude")

                # Inserisce i dati in TPlaces
                nuovo_place = Place(
                    zona_id=nuova_zona.id,
                    place_name=place_name,
                    longitude=longitude,
                    latitude=latitude
                )
                db.session.add(nuovo_place)

            db.session.commit()
            return jsonify({"message": "Zona aggiunta con successo!", "cap": cap}), 201

        return jsonify({"message": "Errore nel recupero dei dati esterni"}), 500

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token non valido!"}), 401


# API per visualizzare la lista dei CAP di un agente
@zona_bp.route("/list-caps", methods=["POST"])
def list_caps():
    # Verifica il Token
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

        agente_id = agente.id

        # Recupera la lista dei CAP associati all'AgenteID
        caps = Zona.query.filter_by(agente_id=agente_id).all()
        if not caps:
            return jsonify({"message": "Nessuna zona registrata per questo agente!"}), 404

        # Crea una lista di CAP
        cap_list = [zona.cap for zona in caps]

        return jsonify({"caps": cap_list}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token non valido!"}), 401

# API per ottenere i Places associati a un CAP
@zona_bp.route("/get-places/<cap>", methods=["GET"])
def get_places(cap):
    token = request.headers.get("x-access-token")
    if not token:
        return jsonify({"message": "Token mancante!"}), 401

    try:
        data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
        email = data["email"]

        agente = Agente.query.filter_by(email=email).first()
        if not agente:
            return jsonify({"message": "Agente non trovato!"}), 404

        zona = Zona.query.filter_by(agente_id=agente.id, cap=cap).first()
        if not zona:
            return jsonify({"message": "Zona non trovata!"}), 404

        places = Place.query.filter_by(zona_id=zona.id).all()
        places_list = [place.place_name for place in places]

        return jsonify({"places": places_list}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token non valido!"}), 401

# API per eliminare una zona
@zona_bp.route("/delete-zone/<cap>", methods=["DELETE"])
def delete_zone(cap):
    token = request.headers.get("x-access-token")
    if not token:
        return jsonify({"message": "Token mancante!"}), 401

    try:
        data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
        email = data["email"]

        agente = Agente.query.filter_by(email=email).first()
        if not agente:
            return jsonify({"message": "Agente non trovato!"}), 404

        zona = Zona.query.filter_by(agente_id=agente.id, cap=cap).first()
        if not zona:
            return jsonify({"message": "Zona non trovata!"}), 404

        # Elimina i Places associati
        Place.query.filter_by(zona_id=zona.id).delete()

        # Elimina la Zona
        db.session.delete(zona)
        db.session.commit()

        return jsonify({"message": "Zona eliminata con successo!"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token non valido!"}), 401


@zona_bp.route("/delete-place", methods=["DELETE"])
@cross_origin()
def delete_place():
    token = request.headers.get("x-access-token")
    if not token:
        return jsonify({"message": "Token mancante!"}), 401

    try:
        data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
        email = data["email"]

        agente = Agente.query.filter_by(email=email).first()
        if not agente:
            return jsonify({"message": "Agente non trovato!"}), 404

        data = request.json  # Riceve il JSON con place_name e cap
        place_name = data.get("place_name")
        cap = data.get("cap")

        if not place_name or not cap:
            return jsonify({"message": "Dati insufficienti!"}), 400

        zona = Zona.query.filter_by(agente_id=agente.id, cap=cap).first()
        if not zona:
            return jsonify({"message": "Zona non trovata!"}), 404

        place = Place.query.filter_by(zona_id=zona.id, place_name=place_name).first()
        if not place:
            return jsonify({"message": "Place non trovato!"}), 404

        db.session.delete(place)
        db.session.commit()

        return jsonify({"message": f"Place {place_name} eliminato con successo!"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token non valido!"}), 401

@zona_bp.route("/delete-all-places", methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_all_places():
    if request.method == "OPTIONS":
        return jsonify({}), 200

    token = request.headers.get("x-access-token")
    if not token:
        return jsonify({"message": "Token mancante!"}), 401

    try:
        data = jwt.decode(token, "chiave_segreta", algorithms=["HS256"])
        email = data["email"]

        agente = Agente.query.filter_by(email=email).first()
        if not agente:
            return jsonify({"message": "Agente non trovato!"}), 404

        request_data = request.get_json() or {}
        cap = request_data.get("cap")
        if not cap:
            return jsonify({"message": "Cap mancante!"}), 400

        zona = Zona.query.filter_by(agente_id=agente.id, cap=cap).first()
        if not zona:
            return jsonify({"message": "Zona non trovata!"}), 404

        # Elimina tutti i Place associati a questa zona
        deleted_count = Place.query.filter_by(zona_id=zona.id).delete()
        db.session.commit()

        return jsonify({"message": f"{deleted_count} place eliminati con successo dalla zona {cap}!"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token scaduto!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Token non valido!"}), 401
