-- Base de datos para el Sistema de Asistencia Híbrida
-- Desarrollado para el backend Spring Boot e integración con App iOS

DROP DATABASE IF EXISTS asistencia_db;
CREATE DATABASE asistencia_db;
USE asistencia_db;

-- 1. Roles del Sistema
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO roles (nombre) VALUES ('ADMIN'), ('TRABAJADOR');

-- 2. Trabajadores (Información General)
CREATE TABLE trabajadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Usuarios de Acceso
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INT,
    trabajador_id INT UNIQUE,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id),
    CONSTRAINT fk_usuario_trabajador FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Modalidades de Trabajo
CREATE TABLE modalidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO modalidades (nombre) VALUES ('PRESENCIAL'), ('VIRTUAL'), ('HIBRIDO'), ('TERRENO');

-- 5. Asistencias (Registro de Entradas y Salidas)
CREATE TABLE asistencias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trabajador_id INT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('ENTRADA', 'SALIDA') NOT NULL,
    modalidad_id INT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    notas TEXT, -- Se usa para casos de enfermedad o avisos especiales
    CONSTRAINT fk_asistencia_trabajador FOREIGN KEY (trabajador_id) REFERENCES trabajadores(id),
    CONSTRAINT fk_asistencia_modalidad FOREIGN KEY (modalidad_id) REFERENCES modalidades(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
