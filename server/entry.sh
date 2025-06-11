#!/bin/sh
set -e

# tiny helper so CRLF never breaks the image when someone commits from Windows
sed -i 's/\r$//' "$0"

echo "⏳ Waiting for MySQL ($DB_HOST:$DB_PORT)…"
until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" --silent; do
  sleep 1
done

echo "🚀 Running Sequelize migrations…"
npx sequelize-cli db:migrate

echo "✅ Starting app"
exec npm run dev
