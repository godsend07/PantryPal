#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
STAMP="$(date +%s)"
EMAIL="smoke_${STAMP}@example.com"
PASSWORD="123456"

log() {
  echo "[smoke] $1"
}

request() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local auth="${4:-}"

  local headers=(-H "Content-Type: application/json")
  if [[ -n "$auth" ]]; then
    headers+=(-H "Authorization: Bearer $auth")
  fi

  if [[ -n "$body" ]]; then
    curl -sS -X "$method" "$BASE_URL$path" "${headers[@]}" -d "$body"
  else
    curl -sS -X "$method" "$BASE_URL$path" "${headers[@]}"
  fi
}

log "Health check"
request "GET" "/api/health" | grep -q '"status":"ok"'

log "Signup"
SIGNUP_RESPONSE="$(request "POST" "/api/auth/signup" "{\"name\":\"Smoke User\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")"
TOKEN="$(echo "$SIGNUP_RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')"
if [[ -z "$TOKEN" ]]; then
  echo "[smoke] Failed to parse auth token"
  echo "$SIGNUP_RESPONSE"
  exit 1
fi

log "Auth me"
request "GET" "/api/auth/me" "" "$TOKEN" | grep -q "\"email\":\"$EMAIL\""

log "Pantry create + list + soon-expiring"
request "POST" "/api/user/pantry" "{\"ingredientName\":\"tomato\",\"quantity\":2,\"unit\":\"pcs\",\"category\":\"produce\",\"storageLocation\":\"fridge\",\"expiryDate\":\"2030-01-01\"}" "$TOKEN" | grep -q '"ingredientName":"tomato"'
request "GET" "/api/user/pantry" "" "$TOKEN" | grep -q '"items"'
request "GET" "/api/user/pantry/soon-expiring?days=3" "" "$TOKEN" | grep -q '"count"'

log "Leftovers create + list"
request "POST" "/api/user/leftovers" "{\"leftoverName\":\"pasta\",\"amount\":1,\"unit\":\"portion\",\"mustUseBy\":\"2030-01-01\"}" "$TOKEN" | grep -q '"message":"Leftover added"'
request "GET" "/api/user/leftovers" "" "$TOKEN" | grep -q '"items"'

log "Waste log create + list"
request "POST" "/api/user/waste-logs" "{\"ingredientName\":\"lettuce\",\"quantity\":1,\"unit\":\"head\",\"reason\":\"expired\",\"estimatedCost\":2,\"estimatedWeightGrams\":150}" "$TOKEN" | grep -q '"message":"Waste log added"'
request "GET" "/api/user/waste-logs" "" "$TOKEN" | grep -q '"items"'

log "Impact metrics"
request "GET" "/api/user/metrics/impact" "" "$TOKEN" | grep -q '"progress"'

log "KPI summary"
request "GET" "/api/user/metrics/kpi-summary?days=30" "" "$TOKEN" | grep -q '"kpis"'

log "Smoke test passed"
