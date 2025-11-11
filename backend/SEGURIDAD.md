# 🔐 SEGURIDAD - GUÍA ANTES DE PRODUCCIÓN

## ⚠️ ESTO ES CRÍTICO - LEE ANTES DE PUBLICAR

---

## 1. JWT_SECRET

### ❌ NUNCA hagas esto:
```env
JWT_SECRET="tu_secreto_jwt_largo_y_unico"
```

### ✅ SIEMPRE haz esto:
```bash
# Generar secreto fuerte de 32 bytes
openssl rand -base64 32
# Ejemplo: 7H3jK9mL5oP2qR8vW1xY4zA6bC0dE3fG7hI

# Usar ese valor en .env
JWT_SECRET="7H3jK9mL5oP2qR8vW1xY4zA6bC0dE3fG7hI"
```

---

## 2. Credenciales por defecto

### ❌ NUNCA dejes estas en producción:
```
admin@local / admin123
```

### ✅ SIEMPRE cambia a producción:

```bash
# Conecta a tu BD
psql -d base-admin

# Cambia la contraseña del admin
UPDATE "User" SET passwordHash = crypt('TU_CONTRASEÑA_FUERTE', gen_salt('bf'))
WHERE email = 'admin@local';

# O crea un usuario nuevo
INSERT INTO "User" (id, email, nombre, "passwordHash", role, "createdAt", "updatedAt")
VALUES (
  'unique-id-here',
  'admin@tu-dominio.com',
  'Administrator',
  crypt('TU_CONTRASEÑA_FUERTE', gen_salt('bf')),
  'ADMIN',
  NOW(),
  NOW()
);
```

---

## 3. CORS

### ❌ NUNCA hagas esto en producción:
```env
CORS_ORIGIN="*"
```

### ✅ SIEMPRE especifica el origen:
```env
CORS_ORIGIN="https://tu-dominio-frontend.com"
```

---

## 4. Base de datos

### ✅ Configura backups automáticos:
```bash
# Backup diario
0 2 * * * /usr/bin/pg_dump -U jesus base-admin | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz
```

### ✅ Limita acceso a BD:
```bash
# Solo acceso local
sudo ufw allow from 127.0.0.1 to any port 5432
```

---

## 5. Variables de entorno

### ✅ NUNCA subas .env a Git:

Verifica `.gitignore`:
```
.env
.env.local
.env.*.local
```

### ✅ Usa variables de entorno en el servidor:

```bash
# En VPS, edita como variables del sistema
export DATABASE_URL="postgresql://..."
export JWT_SECRET="..."
export PORT=3000
```

---

## 6. SSL/HTTPS

### ❌ NUNCA uses HTTP en producción:

### ✅ SIEMPRE configura HTTPS con Let's Encrypt:

```bash
# Instalar certbot
sudo apt-get install certbot python3-certbot-nginx

# Generar certificado para tu dominio
sudo certbot certonly --standalone -d api.tu-dominio.com

# El certificado estará en:
# /etc/letsencrypt/live/api.tu-dominio.com/

# Renovar automáticamente
sudo systemctl enable certbot.timer
```

---

## 7. Firewall

### ✅ Configura firewall UFW:

```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH (IMPORTANTE: antes de bloquear todo!)
sudo ufw allow 22

# Permitir HTTP y HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Bloquear puerto Node.js 3000 (solo internamente)
sudo ufw deny 3000

# Usar Nginx como proxy reverso (ver abajo)

# Ver reglas
sudo ufw status verbose
```

---

## 8. Nginx como Proxy Reverso (Recomendado)

### ✅ Configura Nginx para ocultar Node.js:

```bash
# Instalar Nginx
sudo apt-get install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/backend
```

Pega esto:
```nginx
server {
    listen 80;
    server_name api.tu-dominio.com;

    # Redirigir HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.tu-dominio.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/api.tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tu-dominio.com/privkey.pem;

    # Proxy a Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilita:
```bash
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 9. Monitoreo y Logs

### ✅ Usa PM2 con monitoreo:

```bash
# Instalar PM2 monitoring
pm2 install pm2-logrotate

# Ver estado en tiempo real
pm2 monit

# Guardar snapshot
pm2 save
```

### ✅ Centraliza logs:

```bash
# Ver logs del backend
pm2 logs backend

# Guardar a archivo
pm2 logs backend > logs/backend.log &
```

---

## 10. Rate Limiting

### ✅ Protege contra ataques DDoS (middleware):

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP'
})

app.use('/api/', limiter)
```

Instala: `npm install express-rate-limit`

---

## 11. Validation y Sanitización

### ✅ Valida TODAS las entradas:

```typescript
import { body, validationResult } from 'express-validator'

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // ... resto del login
  }
)
```

Instala: `npm install express-validator`

---

## 12. Headers de Seguridad

### ✅ Usa Helmet para headers seguros:

```typescript
import helmet from 'helmet'

app.use(helmet())
```

Instala: `npm install helmet`

---

## 📋 CHECKLIST DE SEGURIDAD FINAL

- [ ] JWT_SECRET es fuerte (32+ caracteres)
- [ ] .env NO está en Git
- [ ] Contraseñas por defecto cambiadas
- [ ] CORS restringido a tu dominio
- [ ] SSL/HTTPS configurado
- [ ] Nginx proxy configurado
- [ ] Firewall UFW habilitado
- [ ] Solo puertos 80, 443 abiertos
- [ ] Rate limiting implementado
- [ ] Validación de entradas
- [ ] Helmet headers instalado
- [ ] PM2 monitoreo activo
- [ ] Backups BD configurados
- [ ] Logs centralizados

---

## 🚨 EN CASO DE BREACH

1. Cambia JWT_SECRET inmediatamente
2. Invalida todos los tokens existentes
3. Cambia todas las contraseñas de BD
4. Revisa logs: `pm2 logs backend`
5. Haz backup: `pg_dump -U jesus base-admin > backup.sql`
6. Reinicia PM2: `pm2 restart all`

---

**¡Seguridad primero! 🔐**
