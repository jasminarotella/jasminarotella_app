#!/usr/bin/env bash
set -e  # Ferma lo script se un comando fallisce

echo "🚀 Inizio build del frontend..."
cd jasmina_rotella_frontend  # 🔹 CORRETTO IL PERCORSO
npm install
npm run build

echo "✅ Creazione della cartella static nel backend..."
mkdir -p ../jasmina_rotella_backend/app/static

echo "✅ Spostamento della build nel backend..."
mv dist/* ../jasmina_rotella_backend/app/static/

echo "🔧 Installazione delle dipendenze backend..."
cd ../../../jasmina_rotella_backend
pip install -r requirements.txt

echo "✅ Build completata con successo!"
