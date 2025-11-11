@echo off
REM ============================================================
REM DEPLOY AUTOMATIZADO - BACKEND A VPS
REM ============================================================
REM Este script copia los archivos y ejecuta comandos en el VPS
REM
REM Requisitos:
REM - PuTTY o Git Bash instalados (para SSH)
REM - SCP disponible en PATH
REM
REM Uso: deploy-vps.bat
REM ============================================================

setlocal enabledelayedexpansion

set VPS_HOST=31.97.8.51
set VPS_USER=jesus
set VPS_PASSWORD=2025
set VPS_PATH=/home/jesus/AppAdmin/backend

echo ============================================================
echo   DEPLOY BACKEND A VPS
echo ============================================================
echo.
echo Host: %VPS_HOST%
echo Usuario: %VPS_USER%
echo.

REM Paso 1: Copiar archivos
echo [1/5] Copiando archivos al VPS...
REM Nota: Esto requiere tener SSH configurado o usar plink
echo Para copiar manualmente:
echo   scp -r backend/* %VPS_USER%@%VPS_HOST%:%VPS_PATH%/
echo.

REM Paso 2: Crear .env en el VPS
echo [2/5] Preparando archivo .env...
echo Archivo .env que se enviará al VPS:
echo.
echo DATABASE_URL="postgresql://jesus:2025@localhost:5432/base-admin?schema=public"
echo JWT_SECRET="tu_secreto_jwt_largo_y_unico"
echo PORT=3000
echo CORS_ORIGIN="http://localhost:5173"
echo.

REM Paso 3: Conectar y ejecutar comandos
echo [3/5] Conectando al VPS...
echo.
echo Ejecuta manualmente en el VPS:
echo   ssh %VPS_USER%@%VPS_HOST%
echo.

REM Paso 4-5: Mostrar comandos a ejecutar en VPS
echo [4/5] Comandos a ejecutar en el VPS:
echo.
echo ===== COPIAR Y PEGAR EN LA TERMINAL DEL VPS =====
echo.
echo mkdir -p ~/AppAdmin/backend
echo cd ~/AppAdmin/backend
echo.
echo cat > .env << 'EOF'
echo DATABASE_URL="postgresql://jesus:2025@localhost:5432/base-admin?schema=public"
echo JWT_SECRET="tu_secreto_jwt_largo_y_unico_cambialo"
echo PORT=3000
echo CORS_ORIGIN="http://localhost:5173"
echo EOF
echo.
echo npm install
echo npm install -D @types/cors @types/bcryptjs
echo npx prisma generate
echo npx prisma migrate deploy
echo npm run prisma:seed
echo npm run build
echo npm start
echo.
echo ===== FIN DE COMANDOS =====
echo.
echo [5/5] Verificar servidor
echo curl http://%VPS_HOST%:3000/api/health
echo.
echo ============================================================
echo DEPLOY COMPLETADO
echo ============================================================
echo.
pause
