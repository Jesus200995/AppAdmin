# 🚀 GUÍA DE DEPLOY - BACKEND A VPS

## Datos de tu VPS:
- **Host:** 31.97.8.51
- **Usuario SSH:** jesus
- **Contraseña SSH:** 2025
- **Usuario PostgreSQL:** jesus
- **Contraseña PostgreSQL:** 2025
- **Root PostgreSQL:** Lab-312334062
- **Base de datos:** base-admin

---

## PASO 1: Conectar al VPS por SSH

```bash
ssh jesus@31.97.8.51
# Contraseña: 2025
```

---

## PASO 2: Preparar PostgreSQL (si no existe la BD)

En el VPS, conéctate como root a PostgreSQL:

```bash
sudo -u postgres psql
```

Ejecuta los siguientes comandos SQL:

```sql
-- Crear base de datos
CREATE DATABASE "base-admin";

-- Crear usuario si no existe
CREATE USER "jesus" WITH PASSWORD '2025';

-- Asignar permisos
GRANT ALL PRIVILEGES ON DATABASE "base-admin" TO "jesus";
ALTER DATABASE "base-admin" OWNER TO "jesus";

-- Verificar
\l
-- Deberías ver "base-admin" en la lista

-- Salir
\q
```

---

## PASO 3: Descargar y configurar el backend

En el VPS:

```bash
# Crear directorio del proyecto
mkdir -p ~/AppAdmin/backend
cd ~/AppAdmin/backend

# Si tienes git configurado:
# git clone https://github.com/Jesus200995/AppAdmin.git
# cd AppAdmin/backend

# Si copias los archivos manualmente:
# Usa SCP desde tu máquina local:
# scp -r backend/* jesus@31.97.8.51:~/AppAdmin/backend/
```

---

## PASO 4: Configurar variables de entorno

En el VPS, edita o crea `.env`:

```bash
nano .env
```

Pega esto (ajusta CORS_ORIGIN según tu frontend):

```env
DATABASE_URL="postgresql://jesus:2025@localhost:5432/base-admin?schema=public"
JWT_SECRET="tu_secreto_jwt_largo_y_unico_cambialo_en_produccion"
PORT=3000
CORS_ORIGIN="http://localhost:5173"
```

Guarda con: `Ctrl+O`, `Enter`, `Ctrl+X`

---

## PASO 5: Instalar dependencias

En el VPS:

```bash
cd ~/AppAdmin/backend

# Instalar dependencias de Node.js
npm install

# Instalar tipos de desarrollo
npm install -D @types/cors @types/bcryptjs
```

---

## PASO 6: Migrar base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones (crea tablas)
npx prisma migrate deploy

# Seed: crear usuario admin (admin@local / admin123)
npm run prisma:seed
```

**Esperado:** Deberías ver:
```
Seed OK: usuario admin -> admin@local / admin123
```

---

## PASO 7: Compilar y probar

```bash
# Compilar TypeScript
npm run build

# Probar servidor en dev
npm run dev
```

**Esperado:** Deberías ver:
```
API running on http://localhost:3000
```

---

## PASO 8: Probar endpoints

Desde otra terminal del VPS o desde tu máquina:

### Health check:
```bash
curl http://31.97.8.51:3000/api/health
# Respuesta esperada: {"ok":true,"uptime":...}
```

### Login:
```bash
curl -X POST http://31.97.8.51:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@local","password":"admin123"}'

# Respuesta esperada:
# {"token":"eyJ...","user":{...}}
```

### Obtener usuario actual:
```bash
# Reemplaza TU_TOKEN con el token del login anterior
curl http://31.97.8.51:3000/api/users/me \
  -H "Authorization: Bearer TU_TOKEN"

# Respuesta esperada:
# {"id":"...","email":"admin@local","nombre":"Admin","role":"ADMIN"}
```

---

## PASO 9: Producción (PM2)

Para mantener el servidor corriendo en background:

```bash
# Instalar PM2
npm install -g pm2

# Iniciar con PM2
pm2 start npm --name "backend" -- start

# Ver logs
pm2 logs backend

# Ver estado
pm2 status
```

---

## ⚠️ Troubleshooting

### Error: "Can't reach database server at 31.97.8.51:5432"
- Verifica que PostgreSQL está corriendo: `sudo systemctl status postgresql`
- Verifica las credenciales en `.env`
- Verifica permisos: `sudo ufw allow 5432`

### Error: "Invalid token"
- Asegúrate de que JWT_SECRET es igual en frontend y backend
- Verifica que el token tiene formato: `Bearer eyJ...`

### Puerto 3000 ya en uso
- Cambia PORT en `.env` a otro número (ej: 3001)

---

## Próximos pasos

1. **Frontend:** Conecta el frontend a `http://31.97.8.51:3000/api`
2. **SSL/HTTPS:** Configura certificado SSL con Let's Encrypt
3. **Firewall:** Abre solo los puertos necesarios (80, 443, 3000)

¡Listo! 🎉
