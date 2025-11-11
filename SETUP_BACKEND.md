# 📚 APPAMIN - BACKEND SETUP COMPLETO

## ✅ Estado: LISTO PARA VPS

Tu backend está completamente configurado y listo para desplegar en el VPS.

---

## 📂 Archivos de configuración creados

```
backend/
├── src/
│   ├── middleware/auth.ts       ✅ JWT middleware
│   ├── routes/auth.ts           ✅ POST /api/auth/login
│   ├── routes/users.ts          ✅ GET /api/users/me
│   └── index.ts                 ✅ Express app
├── prisma/
│   ├── schema.prisma            ✅ Modelo de BD
│   └── seed.ts                  ✅ Script admin
├── dist/                        ✅ Compilado (generado)
├── .env                         ✅ Configuración
├── .gitignore                   ✅ Git ignore
├── package.json                 ✅ Dependencias
├── tsconfig.json                ✅ TypeScript config
│
└── 📚 DOCUMENTACIÓN:
    ├── README.md                📖 Instrucciones completas
    ├── COMANDOS_VPS.md          🎯 Copy-paste commands
    ├── DEPLOY_VPS.md            📋 Guía paso a paso
    ├── SEGURIDAD.md             🔐 Checklist de seguridad
    ├── setup-db.sql             🗄️  SQL para BD
    ├── setup-vps.sh             🚀 Script bash
    └── DEPLOY_VPS.bat           💻 Script batch
```

---

## 🚀 INICIO RÁPIDO (Opción recomendada)

### En tu VPS, ejecuta estos comandos:

1. **Conéctate:**
```bash
ssh jesus@31.97.8.51
# Contraseña: 2025
```

2. **Copia este bloque completo** y pega en terminal del VPS:

```bash
# Crear BD
sudo -u postgres psql << 'EOF'
CREATE DATABASE "base-admin";
CREATE USER "jesus" WITH PASSWORD '2025';
GRANT ALL PRIVILEGES ON DATABASE "base-admin" TO "jesus";
ALTER DATABASE "base-admin" OWNER TO "jesus";
\q
EOF

# Preparar proyecto
mkdir -p ~/AppAdmin/backend && cd ~/AppAdmin/backend

# Crear .env
cat > .env << 'EOF'
DATABASE_URL="postgresql://jesus:2025@localhost:5432/base-admin?schema=public"
JWT_SECRET="tu_secreto_jwt_largo_y_unico_cambialo_en_produccion"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
EOF

# Setup y arrancar
npm install && \
npm install -D @types/cors @types/bcryptjs && \
npx prisma generate && \
npx prisma migrate deploy && \
npm run prisma:seed && \
npm run build && \
npm start
```

---

## 📖 Documentos disponibles

### Comienza aquí:
- **[README.md](./README.md)** - Guía completa con todas las opciones

### Comando rápido:
- **[COMANDOS_VPS.md](./COMANDOS_VPS.md)** - Comandos copy-paste listos

### Paso a paso:
- **[DEPLOY_VPS.md](./DEPLOY_VPS.md)** - Instrucciones detalladas

### Seguridad (IMPORTANTE):
- **[SEGURIDAD.md](./SEGURIDAD.md)** - Checklist antes de producción

### Scripts:
- **[setup-vps.sh](./setup-vps.sh)** - Script Bash (Linux/Mac)
- **[DEPLOY_VPS.bat](./DEPLOY_VPS.bat)** - Script PowerShell (Windows)
- **[setup-db.sql](./setup-db.sql)** - Crear BD manualmente

---

## 🧪 Verificar que funciona

```bash
# Health check
curl http://31.97.8.51:3000/api/health

# Login con admin
curl -X POST http://31.97.8.51:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"admin123"}'

# Obtener usuario
curl http://31.97.8.51:3000/api/users/me \
  -H "Authorization: Bearer TU_TOKEN"
```

---

## 🔑 Credenciales por defecto

```
Email:    admin@local
Password: admin123
Role:     ADMIN
```

⚠️ **CAMBIA ESTOS VALORES EN PRODUCCIÓN** - Lee SEGURIDAD.md

---

## 📞 Si tienes problemas

1. Lee **[README.md](./README.md)** - Tiene sección troubleshooting
2. Verifica conexión SSH: `ssh jesus@31.97.8.51`
3. Verifica PostgreSQL: `sudo systemctl status postgresql`
4. Verifica logs: `pm2 logs backend`

---

## 🎯 Próximos pasos

1. ✅ Deploy backend a VPS (este documento)
2. 🔗 Conectar frontend a la API
3. 🔐 Configurar SSL/HTTPS
4. 🚀 Configurar PM2 para producción
5. 📊 Agregar más funcionalidades

---

## 📱 Frontend

El frontend (en `../frontend/`) ya está configurado con:
- ✅ React Router para navegación
- ✅ TanStack Query para caché
- ✅ Leaflet + Mapbox para mapas
- ✅ Dexie para BD local offline
- ✅ PWA con Service Worker

Solo necesita conectarse a esta API.

---

## 💾 Archivos importantes

| Archivo | Propósito |
|---------|-----------|
| `.env` | Variables de entorno (⚠️ NO subir a Git) |
| `package.json` | Dependencias y scripts |
| `tsconfig.json` | Configuración TypeScript |
| `prisma/schema.prisma` | Definición de BD |
| `src/middleware/auth.ts` | JWT validation |
| `src/routes/auth.ts` | Login endpoint |
| `src/routes/users.ts` | Usuario endpoint |
| `src/index.ts` | Express app principal |

---

## 🚀 Comandos principales

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Producción
npm start

# Crear/actualizar BD
npx prisma migrate dev --name nombre_migracion

# Ejecutar seed
npm run prisma:seed

# Ver BD
npx prisma studio
```

---

## 📊 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Autenticarse |
| GET | `/api/users/me` | Datos usuario actual |

---

**¡Tu backend está listo! 🎉**

Lee [README.md](./README.md) para instrucciones completas.
