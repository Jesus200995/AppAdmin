# 🎯 COMANDOS COPY-PASTE PARA VPS

## 1️⃣ CONECTAR AL VPS

```bash
ssh jesus@31.97.8.51
# Contraseña: 2025
```

---

## 2️⃣ CREAR BASE DE DATOS (como usuario jesus)

```bash
sudo -u postgres psql
```

Pega esto en PostgreSQL (psql):
```sql
CREATE DATABASE "base-admin";
CREATE USER "jesus" WITH PASSWORD '2025';
GRANT ALL PRIVILEGES ON DATABASE "base-admin" TO "jesus";
ALTER DATABASE "base-admin" OWNER TO "jesus";
\q
```

---

## 3️⃣ PREPARAR DIRECTORIO

```bash
mkdir -p ~/AppAdmin/backend
cd ~/AppAdmin/backend
```

---

## 4️⃣ CREAR ARCHIVO .env

```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://jesus:2025@localhost:5432/base-admin?schema=public"
JWT_SECRET="tu_secreto_jwt_largo_y_unico_cambia_en_produccion_$(openssl rand -base64 32)"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
EOF
```

---

## 5️⃣ INSTALAR DEPENDENCIAS (una sola línea)

```bash
npm install && npm install -D @types/cors @types/bcryptjs
```

---

## 6️⃣ SETUP PRISMA (una sola línea)

```bash
npx prisma generate && npx prisma migrate deploy && npm run prisma:seed
```

---

## 7️⃣ BUILD Y RUN (una sola línea)

```bash
npm run build && npm start
```

---

## 🧪 PROBAR QUE FUNCIONA

### Health check:
```bash
curl http://localhost:3000/api/health
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"admin123"}'
```

### Copiar el token de la respuesta anterior y usarlo:
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🚀 PRODUCCIÓN CON PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar
pm2 start npm --name "backend" -- start

# Logs
pm2 logs backend

# Auto-start en reboot
pm2 startup
pm2 save
```

---

## 📤 DESDE TU MÁQUINA LOCAL (PowerShell)

### Copiar archivos al VPS

```powershell
$scp = "C:\Program Files\Git\usr\bin\scp.exe"  # Ajusta si es necesario

# Copiar carpetas
& $scp -r .\backend\src julius@31.97.8.51:~/AppAdmin/backend/
& $scp -r .\backend\prisma julius@31.97.8.51:~/AppAdmin/backend/

# Copiar archivos
& $scp .\backend\package.json julius@31.97.8.51:~/AppAdmin/backend/
& $scp .\backend\package-lock.json julius@31.97.8.51:~/AppAdmin/backend/
& $scp .\backend\tsconfig.json julius@31.97.8.51:~/AppAdmin/backend/
& $scp .\backend\.env julius@31.97.8.51:~/AppAdmin/backend/
```

---

## 📋 SCRIPT TODO EN UNO (ejecutar en VPS)

```bash
#!/bin/bash
set -e

cd ~/AppAdmin/backend

echo "📦 Instalando dependencias..."
npm install && npm install -D @types/cors @types/bcryptjs

echo "🔄 Configurando Prisma..."
npx prisma generate

echo "🗄️  Migrando BD..."
npx prisma migrate deploy

echo "🌱 Seeding admin..."
npm run prisma:seed

echo "🔨 Compilando..."
npm run build

echo "✅ Setup completado! Iniciando servidor..."
npm start
```

Copiar y guardar como `setup.sh`, luego:
```bash
chmod +x setup.sh
./setup.sh
```

---

## ✅ CHECKLIST FINAL

- [ ] SSH conectado: `ssh jesus@31.97.8.51`
- [ ] PostgreSQL corriendo: `sudo systemctl status postgresql`
- [ ] BD creada: `psql -d base-admin`
- [ ] Node.js instalado: `node --version`
- [ ] npm instalado: `npm --version`
- [ ] Archivos copiados: `ls ~/AppAdmin/backend`
- [ ] .env configurado: `cat ~/AppAdmin/backend/.env`
- [ ] Dependencies OK: `npm install`
- [ ] Prisma OK: `npx prisma generate`
- [ ] BD OK: `npx prisma migrate deploy`
- [ ] Admin creado: `npm run prisma:seed`
- [ ] Build OK: `npm run build`
- [ ] Server corriendo: `npm start`
- [ ] Health check: `curl http://localhost:3000/api/health`

---

**¡Listo para producción! 🎉**
