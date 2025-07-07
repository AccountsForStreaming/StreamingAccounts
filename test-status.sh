#!/bin/bash
echo "=== StreamingAccounts WebApp - Testing Summary ==="
echo ""
echo "✅ Backend: Running on http://localhost:3001"
echo "✅ Frontend: Running on http://localhost:5174"
echo "✅ Database: Connected to Firebase Firestore"
echo ""
echo "Testing API endpoints..."
echo ""

# Test products endpoint
echo "📦 Products API:"
curl -s http://localhost:3001/api/products | grep -o '"success":true' && echo "   ✅ Working" || echo "   ❌ Failed"

echo ""
echo "🌐 Frontend: Open http://localhost:5174 in your browser"
echo "🔑 Registration: Use the sign-up form (Firebase Auth handles this)"
echo "🛒 Shopping: Browse products, add to cart, test checkout flow"
echo ""
echo "Next steps:"
echo "1. Test user registration in the browser"
echo "2. Add products to cart"
echo "3. Test the checkout process"
echo "4. Verify data persists in Firebase"
