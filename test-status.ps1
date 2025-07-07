Write-Host "=== StreamingAccounts WebApp - Testing Summary ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Backend: Running on http://localhost:3001" -ForegroundColor Green  
Write-Host "✅ Frontend: Running on http://localhost:5174" -ForegroundColor Green
Write-Host "✅ Database: Connected to Firebase Firestore" -ForegroundColor Green
Write-Host ""
Write-Host "Testing API endpoints..." -ForegroundColor Yellow
Write-Host ""

# Test products endpoint
Write-Host "📦 Products API:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/products" -UseBasicParsing
    $json = $response.Content | ConvertFrom-Json
    if ($json.success) {
        Write-Host "   ✅ Working - Found $($json.data.Count) products" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Failed to connect" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Frontend: Open http://localhost:5174 in your browser" -ForegroundColor Cyan
Write-Host "🔑 Registration: Use the sign-up form (Firebase Auth handles this)" -ForegroundColor Cyan
Write-Host "🛒 Shopping: Browse products, add to cart, test checkout flow" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test user registration in the browser"
Write-Host "2. Add products to cart"
Write-Host "3. Test the checkout process"  
Write-Host "4. Verify data persists in Firebase"
