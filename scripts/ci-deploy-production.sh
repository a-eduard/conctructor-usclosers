#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/opt/usclosers.com/order}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-usclosers_order}"
APP_CONTAINER="${APP_CONTAINER:-uscloserscom-order}"
HEALTH_URL="${HEALTH_URL:-https://order.usclosers.com/en}"

if [ ! -d "$DEPLOY_DIR" ]; then
  echo "Deploy directory does not exist: $DEPLOY_DIR" >&2
  exit 1
fi

if [ ! -f "$DEPLOY_DIR/.env" ]; then
  echo "Production .env is missing in $DEPLOY_DIR" >&2
  exit 1
fi

mkdir -p "$DEPLOY_DIR/public/images" "$DEPLOY_DIR/public/solutions"

rsync -a --delete \
  --exclude '.git/' \
  --exclude '.gitlab-ci.yml' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env.production' \
  --exclude '.env*.local' \
  --exclude 'node_modules/' \
  --exclude '.next/' \
  --exclude 'coverage/' \
  --exclude 'public/images/' \
  --exclude 'public/solutions/' \
  --exclude 'compose.yaml.bak-*' \
  "$CI_PROJECT_DIR"/ "$DEPLOY_DIR"/

cd "$DEPLOY_DIR"

docker compose -p "$COMPOSE_PROJECT_NAME" config --quiet
docker compose -p "$COMPOSE_PROJECT_NAME" up -d --build --remove-orphans

for _ in $(seq 1 30); do
  status="$(docker inspect "$APP_CONTAINER" --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' 2>/dev/null || true)"
  if [ "$status" = "healthy" ] || [ "$status" = "running" ]; then
    break
  fi
  sleep 3
done

docker inspect "$APP_CONTAINER" --format 'container={{.Name}} status={{.State.Status}} health={{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}'
curl --fail --silent --show-error --location --max-time 20 "$HEALTH_URL" >/dev/null
