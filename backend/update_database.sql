-- Script para actualizar la base de datos y agregar campos de autenticación
-- Ejecutar este script en tu base de datos MySQL

-- Agregar campo email
ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE AFTER name;

-- Agregar campo password (hash)
ALTER TABLE users ADD COLUMN password VARCHAR(255) AFTER email;

-- Actualizar registros existentes con valores por defecto (opcional)
-- UPDATE users SET email = CONCAT(name, '@example.com') WHERE email IS NULL;
-- UPDATE users SET password = '' WHERE password IS NULL;
