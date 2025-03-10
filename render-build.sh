#!/usr/bin/env bash
set -e  # Ferma lo script se un comando fallisce

echo "🚀 Inizio build del frontend..."
cd jasmina_rotella_frontend/frontend
npm install
npm run build

echo "✅ Creazione della cartella static nel backend..."
mkdir -p ../../jasmina_rotella_backend/app/static

echo "✅ Spostamento della build nel backend..."
cd ../..
mv jasmina_rotella_frontend/frontend/dist/* jasmina_rotella_backend/app/static/ || true

echo "🔧 Installazione delle dipendenze backend..."
cd jasmina_rotella_backend
pip install -r requirements.txt

echo "✅ Build completata con successo!"
