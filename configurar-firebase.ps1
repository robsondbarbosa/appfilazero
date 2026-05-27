# Configurar variáveis de ambiente Firebase na Vercel
# Execute na pasta do projeto

$envVars = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyBt16NKxV0elaCebh1CN8tTs-rkxqb1AQc"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "appfilazero.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "appfilazero"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" = "appfilazero.firebasestorage.app"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "55912409258"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:55912409258:web:c244f6d54cf648bd8508d3"
}

Write-Host "Configurando variáveis de ambiente na Vercel..." -ForegroundColor Green

foreach ($var in $envVars.GetEnumerator()) {
    Write-Host "Adicionando: $($var.Key)" -ForegroundColor Yellow
    vercel env add $($var.Key) production --yes 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Tentando método alternativo..." -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Variáveis configuradas!" -ForegroundColor Green
Write-Host ""
Write-Host "Agora faça o redeploy:" -ForegroundColor Cyan
Write-Host "  npx vercel --prod" -ForegroundColor White
