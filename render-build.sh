#!/usr/bin/env bash
set -e  # Ferma lo script se un comando fallisce

echo "🚀 Inizio build del frontend..."
cd /jasminarotella_frontend  # 🔹 CORRETTO IL PERCORSO
npm install
npm run build

echo "✅ Creazione della cartella static nel backend..."
mkdir -p ../jasminarotella_backend/app/static

echo "✅ Spostamento della build nel backend..."
mv dist/* ../jasminarotella_backend/app/static/

echo "🔧 Installazione delle dipendenze backend..."
cd ../../../jasminarotella_backend
pip install -r requirements.txt

echo "✅ Build completata con successo!"
