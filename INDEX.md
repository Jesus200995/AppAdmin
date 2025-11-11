# 📑 ÍNDICE DE DOCUMENTACIÓN

## 🎯 Empieza aquí

| # | Documento | Duración | Descripción |
|---|-----------|----------|-------------|
| 1 | **[SETUP_BACKEND.md](./SETUP_BACKEND.md)** | 5 min | 📌 Punto de entrada. Lee esto primero |
| 2 | **[backend/README.md](./backend/README.md)** | 15 min | Guía completa de setup del backend |
| 3 | **[CONECTAR_FRONTEND_BACKEND.md](./CONECTAR_FRONTEND_BACKEND.md)** | 10 min | Integración frontend-backend |

---

## 🔧 Referencia rápida

| Documento | Para qué | Acceso |
|-----------|----------|--------|
| **[backend/COMANDOS_VPS.md](./backend/COMANDOS_VPS.md)** | ⚡ Copiar/pegar comandos | Rápido |
| **[backend/DEPLOY_VPS.md](./backend/DEPLOY_VPS.md)** | 📋 Step-by-step visual | Detallado |
| **[backend/SEGURIDAD.md](./backend/SEGURIDAD.md)** | 🔐 Security checklist | Crítico |
| **[backend/setup-db.sql](./backend/setup-db.sql)** | 🗄️  SQL directo | BD |
| **[backend/setup-vps.sh](./backend/setup-vps.sh)** | 🐧 Script Bash | Linux/Mac |
| **[backend/DEPLOY_VPS.bat](./backend/DEPLOY_VPS.bat)** | 💻 Script PowerShell | Windows |

---

## 🗺️ Mapeo de carpetas

```
AppAdmin/
├── frontend/                    🎨 React PWA
│   └── README.md (proximamente)
│
├── backend/                     🚀 Express API
│   ├── README.md                📖 Guía backend
│   ├── COMANDOS_VPS.md          ⚡ Copy-paste
│   ├── DEPLOY_VPS.md            📋 Step-by-step
│   ├── DEPLOY_VPS.bat           💻 Windows script
│   ├── SEGURIDAD.md             🔐 Security
│   ├── setup-vps.sh             🐧 Bash script
│   ├── setup-db.sql             🗄️  SQL
│   ├── src/                     Code
│   ├── prisma/                  BD
│   └── package.json             Dependencies
│
└── DOCUMENTACIÓN RAÍZ
    ├── README.md                📚 Overview
    ├── SETUP_BACKEND.md         📌 Entrada principal
    ├── CONECTAR_FRONTEND_BACKEND.md 🔗 Integración
    └── INDEX.md                 📑 Este archivo
```

---

## 🎯 Por tipo de tarea

### 🚀 Quiero desplegar ahora

1. Lee [SETUP_BACKEND.md](./SETUP_BACKEND.md) (5 min)
2. Copia comandos de [backend/COMANDOS_VPS.md](./backend/COMANDOS_VPS.md)
3. Ejecuta en VPS
4. Lee [CONECTAR_FRONTEND_BACKEND.md](./CONECTAR_FRONTEND_BACKEND.md)

### 📋 Necesito paso-a-paso detallado

1. [backend/README.md](./backend/README.md) - Guía completa
2. [backend/DEPLOY_VPS.md](./backend/DEPLOY_VPS.md) - Visual step-by-step
3. [backend/COMANDOS_VPS.md](./backend/COMANDOS_VPS.md) - Ref rápida

### 🔐 Voy a producción

1. **ANTES:** Lee [backend/SEGURIDAD.md](./backend/SEGURIDAD.md) - CRÍTICO
2. Implementa todos los checks
3. Deploy con PM2
4. Monitorea logs

### 💻 Tengo Windows

- Scripts: [backend/DEPLOY_VPS.bat](./backend/DEPLOY_VPS.bat)
- Comandos: [backend/COMANDOS_VPS.md](./backend/COMANDOS_VPS.md)

### 🐧 Tengo Linux/Mac

- Scripts: [backend/setup-vps.sh](./backend/setup-vps.sh)
- SQL: [backend/setup-db.sql](./backend/setup-db.sql)

### 🔗 Conectar frontend-backend

→ [CONECTAR_FRONTEND_BACKEND.md](./CONECTAR_FRONTEND_BACKEND.md)

---

## 📚 Lectura recomendada

### Día 1 (Hoy)
```
1. SETUP_BACKEND.md (5 min)
2. backend/COMANDOS_VPS.md (10 min)
3. Deploy a VPS (30 min)
4. CONECTAR_FRONTEND_BACKEND.md (10 min)
```

### Día 2 (Mañana)
```
1. backend/README.md - secciones skipped (15 min)
2. backend/SEGURIDAD.md - completo (30 min)
3. Implementar security checks (1 hora)
```

### Día 3 (Después)
```
1. backend/DEPLOY_VPS.md - troubleshooting (20 min)
2. Setup PM2/Nginx (30 min)
3. Monitoreo & backups (30 min)
```

---

## ✅ Checklist por documento

### SETUP_BACKEND.md
- [ ] Leí la sección "PASO 1"
- [ ] Entiendo qué hace cada parte
- [ ] Identifiqué documentos relevantes

### backend/README.md
- [ ] Setup PostgreSQL ✅
- [ ] Instalé dependencias ✅
- [ ] Ejecuté migraciones ✅
- [ ] Corrí seed admin ✅
- [ ] Probé health endpoint ✅

### CONECTAR_FRONTEND_BACKEND.md
- [ ] Creé AuthContext.tsx
- [ ] Creé api.ts service
- [ ] Actualicé main.tsx
- [ ] Funciona login
- [ ] Funciona logout

### backend/SEGURIDAD.md
- [ ] JWT_SECRET es fuerte
- [ ] .env NO en Git
- [ ] Contraseños cambiados
- [ ] CORS restringido
- [ ] SSL/HTTPS configurado

---

## 🔥 Comandos más usados

```bash
# Ver todos los docs
ls -la AppAdmin/*.md

# Ver backend docs
ls -la AppAdmin/backend/*.md

# Buscar palabra
grep -r "JWT_SECRET" AppAdmin/backend/

# Ver estructura
tree AppAdmin -L 2 -I 'node_modules|dist'
```

---

## 🚨 Documentos críticos

⚠️ **DEBES leer antes de producción:**
- [backend/SEGURIDAD.md](./backend/SEGURIDAD.md)

✅ **DEBES ejecutar primero:**
- [backend/COMANDOS_VPS.md](./backend/COMANDOS_VPS.md)

🔗 **DEBES integrar después:**
- [CONECTAR_FRONTEND_BACKEND.md](./CONECTAR_FRONTEND_BACKEND.md)

---

## 📊 Documentos por tamaño

| Documento | Líneas | Tiempo | Tipo |
|-----------|--------|--------|------|
| SETUP_BACKEND.md | ~150 | 5 min | 📌 Entrada |
| backend/README.md | ~250 | 15 min | 📖 Guía |
| CONECTAR_FRONTEND_BACKEND.md | ~300 | 15 min | 🔗 Integración |
| backend/COMANDOS_VPS.md | ~200 | 10 min | ⚡ Ref |
| backend/DEPLOY_VPS.md | ~400 | 20 min | 📋 Step-by-step |
| backend/SEGURIDAD.md | ~350 | 20 min | 🔐 Security |

---

## 🎓 Flujo de aprendizaje

```
START
  ↓
SETUP_BACKEND.md (overview)
  ↓
backend/README.md (si quieres detalles)
  ↓
backend/COMANDOS_VPS.md (copy-paste)
  ↓
DEPLOY A VPS
  ↓
CONECTAR_FRONTEND_BACKEND.md (integración)
  ↓
Probar login
  ↓
backend/SEGURIDAD.md (IMPORTANTE!)
  ↓
Implementar security
  ↓
PRODUCCIÓN
```

---

## 🆘 ¿No encuentro qué buscar?

### "Cómo desplegar"
→ [backend/README.md](./backend/README.md)

### "Comandos quick"
→ [backend/COMANDOS_VPS.md](./backend/COMANDOS_VPS.md)

### "Paso a paso"
→ [backend/DEPLOY_VPS.md](./backend/DEPLOY_VPS.md)

### "Seguridad"
→ [backend/SEGURIDAD.md](./backend/SEGURIDAD.md)

### "Frontend y Backend juntos"
→ [CONECTAR_FRONTEND_BACKEND.md](./CONECTAR_FRONTEND_BACKEND.md)

### "SQL directo"
→ [backend/setup-db.sql](./backend/setup-db.sql)

### "Script automatizado"
→ [backend/setup-vps.sh](./backend/setup-vps.sh) (Linux)
→ [backend/DEPLOY_VPS.bat](./backend/DEPLOY_VPS.bat) (Windows)

---

## 📞 Soporte rápido

| Problema | Documentación |
|----------|---------------|
| "Connection refused" | [backend/README.md - Troubleshooting](./backend/README.md) |
| "CORS blocked" | [CONECTAR_FRONTEND_BACKEND.md - CORS](./CONECTAR_FRONTEND_BACKEND.md) |
| "Port already in use" | [backend/README.md - Troubleshooting](./backend/README.md) |
| "npm: not found" | [backend/README.md - Troubleshooting](./backend/README.md) |
| "Database doesn't exist" | [backend/COMANDOS_VPS.md - Paso 2](./backend/COMANDOS_VPS.md) |
| "Token invalid" | [CONECTAR_FRONTEND_BACKEND.md - Auth](./CONECTAR_FRONTEND_BACKEND.md) |

---

**¿Por dónde empiezo?**

→ Lee **[SETUP_BACKEND.md](./SETUP_BACKEND.md)** (5 minutos) ⏱️
