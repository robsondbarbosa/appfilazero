#!/bin/bash

# Build script para FilaZero Mobile
# Gera arquivos de instalação para Android e iOS

echo "🚀 FilaZero Mobile Build Script"
echo "================================"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica dependências
check_dependencies() {
    echo -e "${YELLOW}Verificando dependências...${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js não encontrado${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm não encontrado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependências OK${NC}"
}

# Build do Next.js
build_web() {
    echo -e "\n${YELLOW}📦 Building Next.js...${NC}"
    npm run export
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Build falhou${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Build web concluído${NC}"
}

# Setup Android
setup_android() {
    echo -e "\n${YELLOW}🤖 Configurando Android...${NC}"
    
    if [ ! -d "android" ]; then
        echo "Adicionando plataforma Android..."
        npx cap add android
    fi
    
    npx cap sync android
    
    echo -e "${GREEN}✅ Android configurado${NC}"
}

# Build Android
build_android() {
    echo -e "\n${YELLOW}🔨 Building Android APK...${NC}"
    
    cd android
    
    # Build debug APK
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ APK Debug gerado!${NC}"
        echo "📍 Local: android/app/build/outputs/apk/debug/app-debug.apk"
    fi
    
    # Build release APK (requer keystore)
    if [ -f "keystore.jks" ]; then
        echo -e "\n${YELLOW}🔐 Building Release APK...${NC}"
        ./gradlew assembleRelease
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ APK Release gerado!${NC}"
            echo "📍 Local: android/app/build/outputs/apk/release/app-release.apk"
        fi
    else
        echo -e "${YELLOW}⚠️  Keystore não encontrado. Pulando build release.${NC}"
    fi
    
    cd ..
}

# Setup iOS
setup_ios() {
    echo -e "\n${YELLOW}🍎 Configurando iOS...${NC}"
    
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo -e "${YELLOW}⚠️  iOS build requer macOS${NC}"
        return
    fi
    
    if [ ! -d "ios" ]; then
        echo "Adicionando plataforma iOS..."
        npx cap add ios
    fi
    
    npx cap sync ios
    
    echo -e "${GREEN}✅ iOS configurado${NC}"
}

# Build iOS
build_ios() {
    echo -e "\n${YELLOW}🔨 Building iOS...${NC}"
    
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo -e "${YELLOW}⚠️  Pulando iOS (requer macOS)${NC}"
        return
    fi
    
    cd ios/App
    
    # Abre o Xcode
    echo "Abrindo Xcode..."
    open App.xcworkspace
    
    echo -e "${YELLOW}⚠️  Build iOS deve ser feito manualmente no Xcode${NC}"
    echo "   1. Selecione seu time de desenvolvimento"
    echo "   2. Escolha Product > Archive"
    echo "   3. Distribua pelo App Store Connect"
    
    cd ../..
}

# Gera ícones
generate_icons() {
    echo -e "\n${YELLOW}🎨 Gerando ícones...${NC}"
    
    # Verifica se existe o ícone base
    if [ ! -f "public/icons/icon-base.png" ]; then
        echo -e "${YELLOW}⚠️  Crie public/icons/icon-base.png (1024x1024)${NC}"
        return
    fi
    
    # Usa ImageMagick ou sips (macOS) para gerar ícones
    if command -v convert &> /dev/null; then
        # ImageMagick
        sizes=(72 96 128 144 152 192 384 512)
        for size in "${sizes[@]}"; do
            convert public/icons/icon-base.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
        done
        echo -e "${GREEN}✅ Ícones gerados${NC}"
    elif command -v sips &> /dev/null; then
        # macOS sips
        sizes=(72 96 128 144 152 192 384 512)
        for size in "${sizes[@]}"; do
            sips -z $size $size public/icons/icon-base.png --out public/icons/icon-${size}x${size}.png
        done
        echo -e "${GREEN}✅ Ícones gerados${NC}"
    else
        echo -e "${YELLOW}⚠️  ImageMagick ou sips não encontrado${NC}"
    fi
}

# Menu principal
show_menu() {
    echo -e "\n${GREEN}Escolha uma opção:${NC}"
    echo "1) Build completo (Android + iOS)"
    echo "2) Build Android apenas"
    echo "3) Build iOS apenas"
    echo "4) Setup inicial"
    echo "5) Gerar ícones"
    echo "6) Sair"
    echo
    read -p "Opção: " choice
    
    case $choice in
        1)
            build_web
            setup_android
            build_android
            setup_ios
            build_ios
            ;;
        2)
            build_web
            setup_android
            build_android
            ;;
        3)
            build_web
            setup_ios
            build_ios
            ;;
        4)
            check_dependencies
            setup_android
            setup_ios
            echo -e "\n${GREEN}✅ Setup completo!${NC}"
            ;;
        5)
            generate_icons
            ;;
        6)
            echo "Saindo..."
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida${NC}"
            show_menu
            ;;
    esac
}

# Main
cd "$(dirname "$0")"
check_dependencies
show_menu

echo -e "\n${GREEN}🎉 Build concluído!${NC}"
