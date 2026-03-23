-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS asistencia_db;
USE asistencia_db;

-- 2. TABLA DE ROLES (Administrativos)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 3. TABLA DE MODALIDADES (Tipos de trabajo)
CREATE TABLE IF NOT EXISTS modalidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 4. TABLA DE TRABAJADORES (Núcleo del personal)
CREATE TABLE IF NOT EXISTS trabajadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT TRUE,
    modalidad_id INT,
    es_jefe_terreno BOOLEAN DEFAULT FALSE,
    latitud_virtual DECIMAL(10, 8),
    longitud_virtual DECIMAL(11, 8),
    dias_presencial VARCHAR(100),
    CONSTRAINT fk_trabajador_modalidad FOREIGN KEY (modalidad_id) REFERENCES modalidades(id)
) ENGINE=InnoDB;

-- 5. TABLA DE USUARIOS (Credenciales de acceso)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT,
    trabajador_id INT,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id),
    CONSTRAINT fk_usuario_trabajador FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id)
) ENGINE=InnoDB;

-- 6. TABLA DE CONFIGURACIÓN (GPS Oficial de Oficina)
CREATE TABLE IF NOT EXISTS configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    office_lat DECIMAL(10, 8) NOT NULL,
    office_lng DECIMAL(11, 8) NOT NULL,
    radius INT NOT NULL DEFAULT 50
) ENGINE=InnoDB;

-- 7. TABLA DE ASISTENCIAS (Historial de marcaciones)
CREATE TABLE IF NOT EXISTS asistencias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trabajador_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('ENTRADA', 'SALIDA') NOT NULL,
    modalidad_id INT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    notas TEXT,
    CONSTRAINT fk_asistencia_trabajador FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id),
    CONSTRAINT fk_asistencia_modalidad FOREIGN KEY (modalidad_id) REFERENCES modalidades(id)
) ENGINE=InnoDB;

-- 8. TABLA DE PUNTOS EN TERRENO (Ubicaciones dinámicas para equipos de campo)
CREATE TABLE IF NOT EXISTS puntos_terreno (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    nombre_ubicacion VARCHAR(100),
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_por_id INT,
    CONSTRAINT fk_punto_trabajador FOREIGN KEY (actualizado_por_id) REFERENCES trabajadores(id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- SEMILLA DE DATOS NECESARIOS (DATA SEEDING)
-- ---------------------------------------------------------

-- Insertar Roles
INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'ADMIN'), (2, 'TRABAJADOR');

-- Insertar Modalidades
INSERT IGNORE INTO modalidades (id, nombre) VALUES 
(1, 'PRESENCIAL'), (2, 'VIRTUAL'), (3, 'HIBRIDO'), (4, 'TERRENO');

-- Insertar Configuración Inicial (Coordenadas de ejemplo de Lima)
INSERT IGNORE INTO configuracion (id, office_lat, office_lng, radius) 
VALUES (1, -12.046374, -77.042793, 50);

-- Crear primer usuario Admin (Password: 'admin' - Nota: esto debería ir hasheado por Spring Security)
-- INSERT IGNORE INTO usuarios (username, password, rol_id) VALUES ('admin', '$2a$10$...', 1);
