#!/bin/sh
set -e

echo "Ejecutando migraciones..."
python manage.py migrate

echo "Iniciando servidor en puerto $PORT..."
python manage.py runserver 0.0.0.0:${PORT:-8000}
