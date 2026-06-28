#!/usr/bin/env bash
# Push env vars from production/secrets.env to Vercel (production by default).
# Usage: bash scripts/push-vercel-env.sh [production|preview|development]
set -euo pipefail

TARGET="${1:-production}"
ENV_FILE="production/secrets.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Install Vercel CLI: npm i -g vercel && vercel login"
  exit 1
fi

while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%%#*}"
  line="$(echo "$line" | xargs)"
  [[ -z "$line" ]] && continue
  key="${line%%=*}"
  val="${line#*=}"
  val="${val#\"}"
  val="${val%\"}"
  [[ -z "$key" || -z "$val" ]] && continue
  echo "Setting $key ($TARGET)..."
  printf '%s' "$val" | vercel env add "$key" "$TARGET" --force --yes 2>/dev/null || \
    printf '%s' "$val" | vercel env add "$key" "$TARGET" --force
done < "$ENV_FILE"

echo "Done. Run: vercel env ls"
