#!/usr/bin/env pwsh
# ============================================================
# SETUP BACKEND - INSTRUCCIONES PARA VPS
# ============================================================
# Ejecuta esto en PowerShell para configurar el VPS remoto
# .\deploy-vps.ps1
# ============================================================

$VPS_HOST = "31.97.8.51"
$VPS_USER = "jesus"
$VPS_PASSWORD = "2025"
$VPS_DB_ROOT_PASSWORD = "Lab-312334062"
$DB_NAME = "base-admin"
$DB_USER = "jesus"
$BACKEND_PATH = "/home/jesus/AppAdmin/backend"

Write-Host "🚀 Iniciando deploy del backend al VPS..." -ForegroundColor Green

# Paso 1: Crear carpeta del proyecto en el VPS (si no existe)
Write-Host "`n1️⃣  Creando estructura de carpetas en VPS..." -ForegroundColor Cyan

$commands = @(
    "mkdir -p /home/jesus/AppAdmin/backend",
    "cd /home/jesus/AppAdmin/backend"
)

# Paso 2: Verificar conexión a PostgreSQL
Write-Host "`n2️⃣  Verificando conexión a PostgreSQL..." -ForegroundColor Cyan
Write-Host "   Comando a ejecutar en VPS:"
Write-Host "   psql -h localhost -U postgres -d postgres" -ForegroundColor Yellow
Write-Host "   (Contraseña: Lab-312334062)`n"

# Paso 3: Crear BD si no existe
Write-Host "`n3️⃣  Creando base de datos..." -ForegroundColor Cyan
$createDb = @"
CREATE DATABASE `"$DB_NAME`";
CREATE USER `"$DB_USER`" WITH PASSWORD '2025';
GRANT ALL PRIVILEGES ON DATABASE `"$DB_NAME`" TO `"$DB_USER`";
ALTER DATABASE `"$DB_NAME`" OWNER TO `"$DB_USER`";
"@

Write-Host "   Ejecuta estos comandos en PostgreSQL:" -ForegroundColor Yellow
Write-Host $createDb -ForegroundColor Yellow

# Paso 4: Copiar archivos al VPS
Write-Host "`n4️⃣  Copiando archivos del proyecto al VPS..." -ForegroundColor Cyan
Write-Host "   Si usas SSH/SCP:" -ForegroundColor Yellow
Write-Host "   scp -r backend/* jesus@31.97.8.51:/home/jesus/AppAdmin/backend/" -ForegroundColor Yellow

# Paso 5: Ejecutar setup remoto
Write-Host "`n5️⃣  Ejecutando setup en VPS..." -ForegroundColor Cyan
Write-Host "   Conéctate al VPS:" -ForegroundColor Yellow
Write-Host "   ssh jesus@31.97.8.51" -ForegroundColor Yellow
Write-Host "   Contraseña: 2025`n" -ForegroundColor Yellow

Write-Host "   Luego ejecuta:" -ForegroundColor Yellow
@"
cd /home/jesus/AppAdmin/backend

# Actualizar .env con datos correctos
cat > .env << 'EOF'
DATABASE_URL="postgresql://jesus:2025@localhost:5432/base-admin?schema=public"
JWT_SECRET="cambia_esto_por_un_secreto_largo_y_unico_$(openssl rand -base64 32)"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
EOF

# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Seed: crear admin
npm run prisma:seed

# Compilar
npm run build

# Iniciar servidor (PM2 recomendado para producción)
npm start
# O para desarrollo:
# npm run dev
"@ | Write-Host -ForegroundColor Yellow

# Paso 6: Verificar que funciona
Write-Host "`n6️⃣  Verificar que el servidor está vivo:" -ForegroundColor Cyan
Write-Host "   curl http://31.97.8.51:3000/api/health" -ForegroundColor Yellow

Write-Host "`n✅ Instrucciones completadas!" -ForegroundColor Green
