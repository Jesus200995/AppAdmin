# 🚀 AppAdmin - Setup Backend en VPS

## 📋 Resumen

Este proyecto configura automáticamente tu backend en el VPS con:
- ✅ PostgreSQL (base-admin)
- ✅ Express.js API
- ✅ JWT Authentication
- ✅ Prisma ORM
- ✅ Usuario admin por defecto

---

## 🔑 Credenciales VPS

```
Host:              31.97.8.51
Usuario SSH:       jesus
Contraseña SSH:    2025
Usuario Postgres:  jesus
Contraseña PG:     2025
Root Postgres:     Lab-312334062
Base de datos:     base-admin
```

---

## 📝 Instrucciones Rápidas

### Opción 1: SETUP MANUAL (Recomendado para primer deploy)

**Paso 1:** Abre PowerShell y conéctate al VPS
```powershell
ssh jesus@31.97.8.51
# Contraseña: 2025
```

**Paso 2:** Prepara PostgreSQL (como usuario jesus)
```bash
sudo -u postgres psql
```

Pega esto en psql:
```sql
CREATE DATABASE "base-admin";
CREATE USER "jesus" WITH PASSWORD '2025';
GRANT ALL PRIVILEGES ON DATABASE "base-admin" TO "jesus";
ALTER DATABASE "base-admin" OWNER TO "jesus";
\q
```

**Paso 3:** Copia el backend a tu VPS
```bash
# En tu máquina local (PowerShell)
scp -r .\backend\src julius@31.97.8.51:~/AppAdmin/backend/
scp -r .\backend\prisma julius@31.97.8.51:~/AppAdmin/backend/
scp .\backend\package*.json julius@31.97.8.51:~/AppAdmin/backend/
scp .\backend\tsconfig.json julius@31.97.8.51:~/AppAdmin/backend/
scp .\backend\.env julius@31.97.8.51:~/AppAdmin/backend/
```

**Paso 4:** En el VPS, ejecuta el setup
```bash
cd ~/AppAdmin/backend

# Instalar dependencias
npm install
npm install -D @types/cors @types/bcryptjs

# Generar cliente Prisma
npx prisma generate

# Crear tablas
npx prisma migrate deploy

# Crear usuario admin
npm run prisma:seed

# Compilar
npm run build

# Iniciar servidor
npm start
```

---

### Opción 2: SETUP AUTOMATIZADO (Una sola línea)

**En el VPS:**
```bash
cd ~/AppAdmin/backend && \
npm install && \
npm install -D @types/cors @types/bcryptjs && \
npx prisma generate && \
npx prisma migrate deploy && \
npm run prisma:seed && \
npm run build && \
npm start
```

---

## 🧪 Probar que funciona

### Health Check
```bash
curl http://31.97.8.51:3000/api/health
```

**Respuesta esperada:**
```json
{"ok":true,"uptime":123.45}
```

### Login con usuario admin
```bash
curl -X POST http://31.97.8.51:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@local",
    "password": "admin123"
  }'
```

**Respuesta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clz...",
    "email": "admin@local",
    "nombre": "Admin",
    "role": "ADMIN"
  }
}
```

### Obtener datos del usuario (autenticado)
```bash
# Reemplaza TU_TOKEN con el token del login anterior
curl http://31.97.8.51:3000/api/users/me \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## 📂 Estructura de carpetas

```
backend/
├── src/
│   ├── middleware/
│   │   └── auth.ts          # JWT auth + requireRole
│   ├── routes/
│   │   ├── auth.ts          # POST /api/auth/login
│   │   └── users.ts         # GET /api/users/me
│   └── index.ts             # Express app
├── prisma/
│   ├── schema.prisma        # Definición de BD
│   └── seed.ts              # Script para crear admin
├── dist/                    # Código compilado (generado)
├── .env                     # Variables de entorno
├── package.json
└── tsconfig.json
```

---

## 🔐 Credenciales por defecto

Después del seed, tendrás:

```
Email:    admin@local
Password: admin123
Role:     ADMIN
```

⚠️ **CAMBIA ESTAS CREDENCIALES EN PRODUCCIÓN**

---

## 🚀 Producción (PM2)

Para mantener el servidor corriendo 24/7:

```bash
# Instalar PM2 (si no lo tienes)
npm install -g pm2

# Iniciar aplicación
pm2 start npm --name "appAdmin-backend" -- start

# Ver logs
pm2 logs appAdmin-backend

# Reiniciar
pm2 restart appAdmin-backend

# Detener
pm2 stop appAdmin-backend

# Auto-start al reiniciar el VPS
pm2 startup
pm2 save
```

---

## 🆘 Troubleshooting

### Error: "Can't reach database server"
```bash
# Verifica que PostgreSQL está corriendo
sudo systemctl status postgresql

# Inicia si está parado
sudo systemctl start postgresql
```

### Error: "Database base-admin does not exist"
```bash
# Conecta como root y crea la BD
sudo -u postgres psql -c "CREATE DATABASE \"base-admin\";"
```

### Error: "npm: command not found"
```bash
# Instala Node.js
curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

### Puerto 3000 ya en uso
- Cambia PORT en `.env` a otro (ej: 3001)
- O mata el proceso: `lsof -ti:3000 | xargs kill -9`

---

## 📱 Conectar Frontend

En tu frontend (`frontend/.env.local`), usa:

```env
VITE_API_URL=http://31.97.8.51:3000
```

Luego en las llamadas HTTP:

```typescript
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que puedes hacer SSH: `ssh jesus@31.97.8.51`
2. Verifica que PostgreSQL está corriendo: `sudo systemctl status postgresql`
3. Verifica los logs del servidor: `pm2 logs appAdmin-backend`
4. Revisa el archivo `.env` tiene valores correctos

---

**¡Listo! Tu backend debería estar corriendo en `http://31.97.8.51:3000` 🎉**
