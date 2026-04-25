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
    dias_remotos VARCHAR(100),
    hora_ingreso TIME,
    hora_salida TIME,
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
INSERT IGNORE INTO roles (id, nombre) VALUES 
(1, 'ADMIN'), 
(2, 'TRABAJADOR');

-- Insertar Modalidades
INSERT IGNORE INTO modalidades (id, nombre) VALUES 
(1, 'PRESENCIAL'), 
(2, 'VIRTUAL'), 
(3, 'HIBRIDO'), 
(4, 'TERRENO');

-- Insertar Configuración Inicial (Coordenadas de ejemplo de Lima)
INSERT IGNORE INTO configuracion (id, office_lat, office_lng, radius) VALUES 
(1, -12.046374, -77.042793, 50);

-- Insertar Trabajadores masivos
INSERT IGNORE INTO trabajadores (id, dni, nombres, apellidos, email, telefono, direccion, fecha_ingreso, activo, modalidad_id, es_jefe_terreno, latitud_virtual, longitud_virtual, dias_presencial) VALUES
(1, '71234567', 'Juan Carlos', 'Perez Gonzales', 'juan.perez@empresa.com', '987654321', 'Av. Arequipa 123, Lima', '2023-01-15', 1, 1, 0, NULL, NULL, NULL),
(2, '72345678', 'Maria Elena', 'Gomez Ruiz', 'maria.gomez@empresa.com', '987654322', 'Jr. de la Unión 456, Lima', '2023-02-10', 1, 2, 0, -12.055000, -77.035000, NULL),
(3, '73456789', 'Luis Miguel', 'Torres Silva', 'luis.torres@empresa.com', '987654323', 'Av. Javier Prado 789, San Isidro', '2023-03-22', 1, 3, 0, -12.095000, -77.025000, 'Lunes,Miercoles'),
(4, '74567890', 'Ana Maria', 'Flores Castro', 'ana.flores@empresa.com', '987654324', 'Calle Los Pinos 101, Miraflores', '2023-04-05', 1, 4, 1, NULL, NULL, NULL),
(5, '75678901', 'Carlos Jose', 'Vargas Mendoza', 'carlos.vargas@empresa.com', '987654325', 'Av. La Marina 202, San Miguel', '2023-05-18', 1, 1, 0, NULL, NULL, NULL),
(6, '76789012', 'Rosa Luz', 'Rojas Quispe', 'rosa.rojas@empresa.com', '987654326', 'Jr. Ancash 303, Cercado', '2023-06-30', 1, 2, 0, -12.045000, -77.015000, NULL),
(7, '77890123', 'Jose Antonio', 'Rios Vega', 'jose.rios@empresa.com', '987654327', 'Av. Brasil 404, Jesus Maria', '2023-07-12', 1, 3, 0, -12.075000, -77.045000, 'Martes,Jueves'),
(8, '78901234', 'Carmen Rosa', 'Sanchez Romero', 'carmen.sanchez@empresa.com', '987654328', 'Calle Las Begonias 505, San Isidro', '2023-08-25', 1, 4, 0, NULL, NULL, NULL),
(9, '79012345', 'Jorge Luis', 'Castillo Peña', 'jorge.castillo@empresa.com', '987654329', 'Av. Benavides 606, Miraflores', '2023-09-08', 1, 1, 0, NULL, NULL, NULL),
(10, '70123456', 'Patricia', 'Herrera Cruz', 'patricia.herrera@empresa.com', '987654330', 'Jr. Camaná 707, Lima', '2023-10-21', 1, 2, 0, -12.035000, -77.025000, NULL),
(11, '81234567', 'Miguel Angel', 'Salazar Pineda', 'miguel.salazar@empresa.com', '987654331', 'Av. Tacna 808, Lima', '2023-11-03', 1, 3, 0, -12.065000, -77.055000, 'Lunes,Viernes'),
(12, '82345678', 'Lucia', 'Ramirez Soto', 'lucia.ramirez@empresa.com', '987654332', 'Calle Grau 909, Barranco', '2023-12-16', 1, 4, 1, NULL, NULL, NULL),
(13, '83456789', 'Fernando', 'Gutierrez León', 'fernando.gutierrez@empresa.com', '987654333', 'Av. Salaverry 1010, Jesus Maria', '2024-01-29', 1, 1, 0, NULL, NULL, NULL),
(14, '84567890', 'Silvia', 'Chavez Muñoz', 'silvia.chavez@empresa.com', '987654334', 'Jr. Lampa 1111, Lima', '2024-02-11', 1, 2, 0, -12.025000, -77.015000, NULL),
(15, '85678901', 'Ricardo', 'Morales Paz', 'ricardo.morales@empresa.com', '987654335', 'Av. Ejercito 1212, Magdalena', '2024-03-24', 1, 3, 0, -12.085000, -77.065000, 'Miercoles,Jueves');

-- Insertar Usuarios masivos
INSERT IGNORE INTO usuarios (id, username, password, rol_id, trabajador_id) VALUES
(1, 'admin', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 1, NULL), -- Password: password
(2, 'jperez', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 1),
(3, 'mgomez', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 2),
(4, 'ltorres', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 3),
(5, 'aflores', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 4),
(6, 'cvargas', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 5),
(7, 'rrojas', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 6),
(8, 'jrios', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 7),
(9, 'csanchez', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 8),
(10, 'jcastillo', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 9),
(11, 'pherrera', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 10),
(12, 'msalazar', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 11),
(13, 'lramirez', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 12),
(14, 'fgutierrez', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 13),
(15, 'schavez', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 14),
(16, 'rmorales', '$2a$10$wE/.76M.j/e6T3k8.wLz3.2.0XQ4w42/7Xv8C1T4O/h8h0C/H8A.W', 2, 15);

-- Insertar Asistencias masivas (Historial)
INSERT IGNORE INTO asistencias (id, trabajador_id, fecha_hora, tipo, modalidad_id, latitud, longitud, notas) VALUES
(1, 1, '2024-03-01 08:00:00', 'ENTRADA', 1, -12.046374, -77.042793, 'Ingreso a tiempo oficina'),
(2, 1, '2024-03-01 17:05:00', 'SALIDA', 1, -12.046374, -77.042793, 'Salida fin de jornada'),
(3, 2, '2024-03-01 08:10:00', 'ENTRADA', 2, -12.055010, -77.035020, 'Ingreso virtual desde casa'),
(4, 2, '2024-03-01 17:00:00', 'SALIDA', 2, -12.055010, -77.035020, 'Salida virtual'),
(5, 3, '2024-03-01 07:55:00', 'ENTRADA', 3, -12.046374, -77.042793, 'Día presencial asignado'),
(6, 3, '2024-03-01 17:15:00', 'SALIDA', 3, -12.046374, -77.042793, 'Salida presencial'),
(7, 4, '2024-03-01 08:30:00', 'ENTRADA', 4, -12.115000, -77.025000, 'Llegada a obra sector sur'),
(8, 4, '2024-03-01 17:30:00', 'SALIDA', 4, -12.115000, -77.025000, 'Retiro de obra'),
(9, 1, '2024-03-04 08:05:00', 'ENTRADA', 1, -12.046374, -77.042793, 'Ingreso a tiempo oficina'),
(10, 1, '2024-03-04 17:02:00', 'SALIDA', 1, -12.046374, -77.042793, 'Salida fin de jornada'),
(11, 2, '2024-03-04 08:00:00', 'ENTRADA', 2, -12.055010, -77.035020, 'Ingreso virtual desde casa'),
(12, 2, '2024-03-04 17:05:00', 'SALIDA', 2, -12.055010, -77.035020, 'Salida virtual'),
(13, 3, '2024-03-04 08:05:00', 'ENTRADA', 3, -12.095010, -77.025020, 'Día virtual asignado'),
(14, 3, '2024-03-04 17:00:00', 'SALIDA', 3, -12.095010, -77.025020, 'Salida virtual'),
(15, 4, '2024-03-04 08:15:00', 'ENTRADA', 4, -12.115000, -77.025000, 'Llegada a obra sector sur'),
(16, 4, '2024-03-04 18:00:00', 'SALIDA', 4, -12.115000, -77.025000, 'Retiro de obra (horas extras)'),
(17, 5, '2024-03-01 07:45:00', 'ENTRADA', 1, -12.046374, -77.042793, 'Ingreso anticipado'),
(18, 5, '2024-03-01 17:00:00', 'SALIDA', 1, -12.046374, -77.042793, 'Salida normal'),
(19, 6, '2024-03-01 08:02:00', 'ENTRADA', 2, -12.045010, -77.015020, 'Inicio virtual'),
(20, 6, '2024-03-01 17:03:00', 'SALIDA', 2, -12.045010, -77.015020, 'Fin virtual'),
(21, 7, '2024-03-01 08:00:00', 'ENTRADA', 3, -12.075010, -77.045020, 'Virtual desde casa'),
(22, 7, '2024-03-01 17:00:00', 'SALIDA', 3, -12.075010, -77.045020, 'Fin virtual'),
(23, 8, '2024-03-01 08:20:00', 'ENTRADA', 4, -12.125000, -77.035000, 'Terreno punto norte'),
(24, 8, '2024-03-01 17:15:00', 'SALIDA', 4, -12.125000, -77.035000, 'Terreno punto norte salida'),
(25, 9, '2024-03-01 08:05:00', 'ENTRADA', 1, -12.046374, -77.042793, 'Ingreso oficina'),
(26, 9, '2024-03-01 17:10:00', 'SALIDA', 1, -12.046374, -77.042793, 'Salida oficina'),
(27, 10, '2024-03-01 07:58:00', 'ENTRADA', 2, -12.035010, -77.025020, 'Virtual'),
(28, 10, '2024-03-01 17:05:00', 'SALIDA', 2, -12.035010, -77.025020, 'Virtual'),
(29, 11, '2024-03-01 08:00:00', 'ENTRADA', 3, -12.046374, -77.042793, 'Presencial oficina'),
(30, 11, '2024-03-01 17:00:00', 'SALIDA', 3, -12.046374, -77.042793, 'Presencial oficina');

-- Insertar Puntos en Terreno masivos
INSERT IGNORE INTO puntos_terreno (id, latitud, longitud, nombre_ubicacion, fecha_actualizacion, actualizado_por_id) VALUES
(1, -12.115000, -77.025000, 'Obra Sector Sur', '2024-03-01 08:00:00', 4),
(2, -12.125000, -77.035000, 'Obra Sector Norte', '2024-03-01 08:00:00', 4),
(3, -12.095000, -77.015000, 'Planta Principal', '2024-03-02 09:30:00', 8),
(4, -12.105000, -77.045000, 'Almacén Callao', '2024-03-03 10:15:00', 8),
(5, -12.085000, -77.055000, 'Terreno San Miguel', '2024-03-04 11:20:00', 12),
(6, -12.075000, -77.065000, 'Sede Magdalena', '2024-03-05 14:00:00', 12);
