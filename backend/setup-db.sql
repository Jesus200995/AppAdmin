-- ============================================================
-- SETUP BASE DE DATOS - APPAMIN
-- ============================================================
-- Ejecuta esto como usuario root en PostgreSQL del VPS
--
-- Uso:
-- psql -h localhost -U postgres -d postgres -f setup-db.sql
-- Contraseña: Lab-312334062
-- ============================================================

-- Crear base de datos
CREATE DATABASE "base-admin"
  WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0;

-- Crear usuario
CREATE USER "jesus" WITH PASSWORD '2025';

-- Asignar permisos
GRANT ALL PRIVILEGES ON DATABASE "base-admin" TO "jesus";

-- Conectar a la BD y asignar esquema
\c base-admin

-- Crear esquema public si no existe
CREATE SCHEMA IF NOT EXISTS public;

-- Asignar permisos al esquema
GRANT ALL PRIVILEGES ON SCHEMA public TO "jesus";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "jesus";

-- Verificar
SELECT datname, datowner FROM pg_database WHERE datname = 'base-admin';
SELECT usename FROM pg_user WHERE usename = 'jesus';

\q
