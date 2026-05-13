# 📱 FilaZero Mobile - Guia de Build

## Visão Geral

O FilaZero é um Progressive Web App (PWA) que pode ser:
1. **Instalado diretamente** do navegador (PWA)
2. **Compilado para apps nativos** Android e iOS (via Capacitor)

---

## 🚀 Opção 1: PWA (Recomendado para testes)

A maneira mais rápida de ter o app no celular.

### Instalação no Android
1. Abra o Chrome no celular
2. Acesse: `https://seu-dominio.com`
3. Toque no menu (⋮) → "Adicionar à tela inicial"
4. O app será instalado como um app nativo

### Instalação no iOS
1. Abra o Safari no iPhone/iPad
2. Acesse: `https://seu-dominio.com`
3. Toque no botão Compartilhar (□↑)
4. Selecione "Adicionar à Tela de Início"

---

## 🔧 Opção 2: Build Nativo (Android/iOS)

### Pré-requisitos

#### Android
- [Node.js](https://nodejs.org/) 18+
- [Android Studio](https://developer.android.com/studio)
- [JDK 17](https://adoptium.net/)
- [Capacitor CLI](https://capacitorjs.com/)

#### iOS (requer macOS)
- [Xcode](https://developer.apple.com/xcode/) 14+
- [CocoaPods](https://cocoapods.org/)
- Conta de desenvolvedor Apple ($99/ano)

---

## 📦 Build Automático

### Usando o script

```bash
cd apps/web
chmod +x scripts/build-mobile.sh
./scripts/build-mobile.sh
```

### Comandos npm

```bash
# Build web
npm run export

# Setup Android
npm run cap:add:android

# Setup iOS
npm run cap:add:ios

# Sincronizar mudanças
npm run cap:sync

# Build Android
npm run cap:build:android

# Build iOS (abre Xcode)
npm run cap:open:ios
```

---

## 🤖 Build Android Detalhado

### 1. Setup Inicial

```bash
cd apps/web

# Instala dependências
npm install

# Build do Next.js
npm run export

# Adiciona Android
npx cap add android
```

### 2. Configurar Keystore (Release)

```bash
cd android

# Gera keystore
keytool -genkey -v \
  -keystore filazero.keystore \
  -alias filazero \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Crie `android/key.properties`:
```properties
storePassword=sua-senha
keyPassword=sua-senha
keyAlias=filazero
storeFile=filazero.keystore
```

### 3. Build APK

```bash
# Debug APK
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease
```

### 4. Local dos APKs

- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🍎 Build iOS Detalhado

### 1. Setup Inicial

```bash
cd apps/web

# Build do Next.js
npm run export

# Adiciona iOS
npx cap add ios
```

### 2. Configurar no Xcode

```bash
# Abre o projeto
npx cap open ios
```

No Xcode:
1. Selecione o projeto "App"
2. Em "Signing & Capabilities", selecione seu time
3. Configure o Bundle Identifier: `com.filazero.app`
4. Conecte seu iPhone

### 3. Build e Deploy

```bash
# Build para dispositivo
Product > Build (⌘+B)

# Archive para App Store
Product > Archive

# Distribuir
Window > Organizer > Distribute App
```

---

## 🎨 Ícones e Splash Screens

### Gerar ícones automaticamente

Coloque um ícone base em `public/icons/icon-base.png` (1024x1024) e execute:

```bash
# Com ImageMagick
convert icon-base.png -resize 192x192 icon-192x192.png

# Ou use o script
./scripts/generate-icons.sh
```

### Ícones necessários

| Tamanho | Uso |
|---------|-----|
| 72x72 | Android ldpi |
| 96x96 | Android mdpi |
| 128x128 | Notificações |
| 144x72 | Android hdpi |
| 152x152 | iPad |
| 192x192 | Android xhdpi, PWA |
| 384x384 | Android xxhdpi |
| 512x512 | PWA, Android xxxhdpi |

### Splash Screens

Coloque em `resources/`:
- `splash.png` (2732x2732)
- `icon.png` (1024x1024)

```bash
# Gera splash screens para todas plataformas
npx cordova-res ios --skip-config --copy
npx cordova-res android --skip-config --copy
```

---

## 📋 Checklist antes do Build

- [ ] Ícones gerados em todas resoluções
- [ ] Splash screen configurada
- [ ] `appId` correto no `capacitor.config.ts`
- [ ] `appName` definido
- [ ] Variáveis de ambiente configuradas
- [ ] Testado em modo PWA primeiro
- [ ] Imagens otimizadas

---

## 🔐 Publicação nas Lojas

### Google Play Store

1. Crie conta de desenvolvedor ($25 único)
2. Acesse [Play Console](https://play.google.com/console)
3. Crie novo app
4. Gere Android App Bundle (AAB):
   ```bash
   ./gradlew bundleRelease
   ```
5. Faça upload do AAB
6. Preencha informações da loja
7. Envie para revisão

### Apple App Store

1. Assine Apple Developer Program ($99/ano)
2. Acesse [App Store Connect](https://appstoreconnect.apple.com)
3. Crie novo app
4. Configure certificados e provisioning profiles
5. Faça Archive no Xcode
6. Envie para App Store Connect
7. Preencha informações da loja
8. Envie para revisão

---

## 🐛 Troubleshooting

### Android

**Erro: "Could not find method namespace()"**
```bash
# Atualize o Gradle
./gradlew wrapper --gradle-version 8.0
```

**Erro: "Keystore file not found"**
- Verifique se o arquivo `filazero.keystore` está em `android/`
- Confira o caminho em `key.properties`

### iOS

**Erro: "No account for team"**
- Adicione sua conta Apple em Xcode → Preferences → Accounts
- Selecione o time em Signing & Capabilities

**Erro: "CocoaPods not installed"**
```bash
sudo gem install cocoapods
pod setup
```

---

## 📚 Recursos

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Publishing](https://developer.android.com/studio/publish)
- [iOS Publishing](https://developer.apple.com/documentation/xcode/distributing-your-app)
- [PWA Checklist](https://web.dev/pwa-checklist/)
