#!/bin/bash

# ============================================================
# SETUP AUTOMATIZADO BACKEND - APPAMIN VPS
# ============================================================
# Ejecuta este script en tu VPS para configurar la BD y API
# bash setup-vps.sh
# ============================================================

set -e

echo "🚀 Iniciando setup del backend en VPS..."

# 1. Variables de entorno
export DATABASE_URL="postgresql://jesus:2025@localhost:5432/base-admin?schema=public"
export JWT_SECRET="tu_secreto_jwt_cambialo_en_produccion_$(openssl rand -base64 32)"
export PORT=3000
export CORS_ORIGIN="http://tu-dominio-frontend.com"

echo "✅ Variables de entorno configuradas"

# 2. Instalar dependencias (si no están instaladas)
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependencias..."
  npm install
  npm install -D @types/cors @types/bcryptjs
fi

echo "✅ Dependencias listas"

# 3. Generar cliente Prisma
echo "🔄 Generando cliente Prisma..."
npx prisma generate

# 4. Ejecutar migraciones
echo "🗄️  Ejecutando migraciones..."
npx prisma migrate deploy

# 5. Seed: crear usuario admin
echo "🌱 Creando usuario admin..."
npm run prisma:seed

# 6. Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build

echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Verifica que el archivo .env tenga los valores correctos"
echo "2. Inicia el servidor: npm run start (o npm run dev)"
echo "3. Prueba: curl http://localhost:3000/api/health"
