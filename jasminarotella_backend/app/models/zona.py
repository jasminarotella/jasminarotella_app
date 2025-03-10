from config.database import db

# Tabella delle Zone
class Zona(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    agente_id = db.Column(db.Integer, nullable=False)
    cap = db.Column(db.String(10), nullable=False)

# Tabella dei PlaceName associati a una Zona
class Place(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    zona_id = db.Column(db.Integer, db.ForeignKey('zona.id'), nullable=False)
    place_name = db.Column(db.String(100), nullable=False)
    longitude = db.Column(db.Float, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
