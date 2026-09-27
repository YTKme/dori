#!/bin/sh
# Container entrypoint. Usage: entrypoint.sh [migrate|serve]
set -e
cd /app

wait_for_postgres() {
  echo "Waiting for PostgreSQL at ${DORI_POSTGRESQL_HOST}:${DORI_POSTGRESQL_PORT:-5432}…"
  until node -e "const net=require('net');const s=net.connect(Number(process.env.DORI_POSTGRESQL_PORT||5432),process.env.DORI_POSTGRESQL_HOST);s.on('connect',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1));" 2>/dev/null; do
    sleep 1
  done
  echo "PostgreSQL is up."
}

case "${1:-serve}" in
  migrate)
    wait_for_postgres
    echo "Applying database migrations…"
    ./node_modules/.bin/drizzle-kit migrate
    if [ "${DORI_SEED:-false}" = "true" ]; then
      echo "Seeding demo data…"
      ./node_modules/.bin/tsx ./src/_drizzle/plant.ts
    fi
    echo "Migrations complete."
    ;;
  serve)
    echo "Starting Dori…"
    exec node .output/server/index.mjs
    ;;
  *)
    exec "$@"
    ;;
esac
