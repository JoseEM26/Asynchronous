-- DATA INITIALIZATION - ASISTENCIA HIBRIDA (EXTENDIDO)
-- Este archivo se ejecuta automáticamente al iniciar la aplicación Spring Boot.

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Roles
INSERT IGNORE INTO roles (id, nombre) VALUES 
(1, 'ADMIN'), 
(2, 'TRABAJADOR'),
(3, 'JEFE_TERRENO'),
(4, 'TRABAJADOR_TERRENO'),
(5, 'SUPER_ADMIN');

-- 2. Modalidades
INSERT IGNORE INTO modalidades (id, nombre) VALUES 
(1, 'PRESENCIAL'), 
(2, 'VIRTUAL / REMOTO'), 
(3, 'HIBRIDO'), 
(4, 'TERRENO'),
(5, 'EXENTO / ADMINISTRATIVO');

-- 3. Configuración
INSERT IGNORE INTO configuracion (id, office_lat, office_lng, radius) VALUES 
(1, -12.046374, -77.042793, 100);

-- 4. Trabajadores (Jerarquía Completa)
-- 4. Trabajadores (Jerarquía Completa)
INSERT IGNORE INTO trabajadores (id, dni, nombres, apellidos, email, telefono, direccion, fecha_ingreso, activo, modalidad_id, es_jefe_terreno, jefe_id, rol_id) VALUES
(1, '71234567', 'Admin', 'General', 'admin@geocheck.com', '900000001', 'Oficina Central', '2023-01-01', 1, 5, 0, NULL, 1),
-- Equipo A (Terreno)
(4, '74567890', 'Ana Maria', 'Flores Castro', 'ana.flores@empresa.com', '987654324', 'Calle Los Pinos 101, Miraflores', '2023-04-05', 1, 4, 1, NULL, 3),
(5, '75678901', 'Carlos Jose', 'Vargas Mendoza', 'carlos.vargas@empresa.com', '987654325', 'Av. La Marina 202', '2023-05-18', 1, 4, 0, 4, 4),
(10, '70123456', 'Patricia', 'Herrera Cruz', 'patricia.herrera@empresa.com', '987654330', 'Jr. Camaná 707', '2023-10-21', 1, 4, 0, 4, 4),
-- Equipo B (Terreno)
(6, '76789012', 'Roberto', 'Sanchez Lee', 'roberto.sanchez@empresa.com', '999888777', 'Av. Brasil 500', '2023-06-01', 1, 4, 1, NULL, 3),
(12, '82345678', 'Lucia', 'Ramirez Soto', 'lucia.ramirez@empresa.com', '987654332', 'Calle Grau 909', '2023-12-16', 1, 4, 0, 6, 4),
-- Equipo C (Híbrido)
(8, '78901234', 'Diego', 'Rojas Quispe', 'diego.rojas@empresa.com', '999444555', 'Av. Larco 456', '2023-08-20', 1, 3, 0, NULL, 2),
(15, '85678901', 'Ricardo', 'Morales Paz', 'ricardo.morales@empresa.com', '987654335', 'Av. Ejercito 1212', '2024-03-24', 1, 3, 0, 8, 2),
-- Equipo D (Virtual)
(16, '86789012', 'Sonia', 'Alva Ruiz', 'sonia.alva@empresa.com', '987654336', 'Jr. Junin 404', '2024-01-10', 1, 2, 0, NULL, 2),
(17, '87890123', 'Miguel', 'Pinto Solis', 'miguel.pinto@empresa.com', '987654337', 'Av. Wilson 505', '2024-02-15', 1, 2, 0, 16, 2),
-- Equipo E (Presencial)
(18, '88901234', 'Elena', 'Torres Vega', 'elena.torres@empresa.com', '987654338', 'Calle Lima 606', '2024-03-01', 1, 1, 0, NULL, 2),
(19, '89012345', 'Hugo', 'Lozano Jara', 'hugo.lozano@empresa.com', '987654339', 'Av. Tacna 707', '2024-03-10', 1, 1, 0, 18, 2),
-- Usuarios Inactivos de Prueba
(20, '90123456', 'Juan', 'Perez Off', 'juan.off@empresa.com', '987654340', 'Calle Muerta 000', '2024-01-01', 0, 1, 0, NULL, 2);

-- 5. Usuarios (Password: 123456)
INSERT IGNORE INTO usuarios (id, username, password, rol_id, trabajador_id, activo, two_factor_enabled) VALUES
(1, 'admin', '123456', 1, 1, 1, 0),
(2, 'aflores', '123456', 3, 4, 1, 0),
(3, 'rsanchez', '123456', 3, 6, 1, 0),
(4, 'drojas', '123456', 2, 8, 1, 0),
(5, 'cvargas', '123456', 4, 5, 1, 0),
(6, 'lramirez', '123456', 4, 12, 1, 0),
(7, 'rmorales', '123456', 2, 15, 1, 0),
(8, 'salva', '123456', 2, 16, 1, 0),
(9, 'mpinto', '123456', 2, 17, 1, 0),
(10, 'etorres', '123456', 2, 18, 1, 0),
(11, 'hlozano', '123456', 2, 19, 1, 0),
(12, 'pherrera', '123456', 4, 10, 1, 0),
(13, 'juanperez', '123456', 2, 20, 0, 0);

-- 6. Puntos en Terreno
INSERT IGNORE INTO puntos_terreno (id, latitud, longitud, nombre_ubicacion, fecha_actualizacion, actualizado_por_id) VALUES
(1, -12.115000, -77.025000, 'Obra San Isidro - Torre A', '2024-03-01 08:00:00', 4),
(2, -12.045000, -77.015000, 'Planta Industrial Norte', '2024-03-01 08:30:00', 6),
(3, -12.145000, -77.015000, 'Almacén Chorrillos', '2024-03-01 09:00:00', 4);

SET FOREIGN_KEY_CHECKS = 1;
