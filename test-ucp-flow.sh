#!/bin/bash
# Test script for UCP Checkout API flow

BASE_URL="http://localhost:3000/api/ucp"

echo "=== Testing UCP Checkout Flow ==="
echo ""

# 1. Create checkout session
echo "1. Creating checkout session..."
CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/checkout-sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "line_items": [
      {
        "offer_id": "apple_01",
        "quantity": 2,
        "unit_price": {
          "value": "480.00",
          "currency": "JPY"
        },
        "title": "ご褒美りんごジュエル"
      }
    ],
    "currency": "JPY",
    "payment": {
      "methods": [
        {
          "type": "card",
          "provider": "stripe"
        }
      ]
    }
  }')

SESSION_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✓ Session created: $SESSION_ID"
echo ""

# 2. Get checkout session
echo "2. Getting checkout session..."
curl -s -X GET "${BASE_URL}/checkout-sessions/${SESSION_ID}" | jq '.status, .totals'
echo ""

# 3. Update checkout session (add buyer info)
echo "3. Updating checkout session with buyer info..."
curl -s -X PUT "${BASE_URL}/checkout-sessions/${SESSION_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "buyer": {
      "email": "test@example.com",
      "name": {
        "given_name": "太郎",
        "family_name": "山田"
      }
    }
  }' | jq '.buyer'
echo ""

# 4. Complete checkout session
echo "4. Completing checkout session..."
curl -s -X POST "${BASE_URL}/checkout-sessions/${SESSION_ID}/complete" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.status, .order'
echo ""

echo "=== Test Complete ==="
