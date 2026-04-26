-- SEED DATA - ASISTENCIA HIBRIDA (EXTENDIDO PARA PRUEBAS DE EQUIPO)
-- Este script inserta datos masivos para probar las jerarquías de JEFE_TERRENO y TRABAJADOR_TERRENO.

USE railway;

SET FOREIGN_KEY_CHECKS = 0;

-- Limpieza de tablas
TRUNCATE TABLE asistencias;
TRUNCATE TABLE puntos_terreno;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE trabajadores;
TRUNCATE TABLE modalidades;
TRUNCATE TABLE roles;
TRUNCATE TABLE configuracion;
TRUNCATE TABLE comunicados;

-- 1. Roles
INSERT INTO roles (id, nombre) VALUES 
(1, 'ADMIN'), 
(2, 'TRABAJADOR'),
(3, 'JEFE_TERRENO'),
(4, 'TRABAJADOR_TERRENO'),
(5, 'SUPER_ADMIN');

-- 2. Modalidades
INSERT INTO modalidades (id, nombre) VALUES 
(1, 'PRESENCIAL'), 
(2, 'VIRTUAL / REMOTO'), 
(3, 'HIBRIDO'), 
(4, 'TERRENO'),
(5, 'EXENTO / ADMINISTRATIVO');

-- 3. Configuración Central (Lima)
INSERT INTO configuracion (id, office_lat, office_lng, radius) VALUES 
(1, -12.046374, -77.042793, 100);

-- 4. TRABAJADORES (Jerarquía de Equipos de Terreno)
-- Columnas: id, dni, nombres, apellidos, email, telefono, direccion, fecha_ingreso, activo, modalidad_id, es_jefe_terreno, jefe_id, rol_id
INSERT INTO trabajadores (id, dni, nombres, apellidos, email, telefono, direccion, fecha_ingreso, activo, modalidad_id, es_jefe_terreno, jefe_id, rol_id) VALUES
-- Administradores
(1, '71234567', 'Admin', 'General', 'admin@geocheck.com', '900000001', 'Oficina Central', '2023-01-01', 1, 5, 0, NULL, 1),

-- EQUIPO A: Liderado por ANA FLORES (ID 4)
(4, '74567890', 'Ana Maria', 'Flores Castro', 'ana.flores@empresa.com', '987654324', 'Calle Los Pinos 101, Miraflores', '2023-04-05', 1, 4, 1, NULL, 3),
(5, '75678901', 'Carlos Jose', 'Vargas Mendoza', 'carlos.vargas@empresa.com', '987654325', 'Av. La Marina 202', '2023-05-18', 1, 4, 0, 4, 4),
(10, '70123456', 'Patricia', 'Herrera Cruz', 'patricia.herrera@empresa.com', '987654330', 'Jr. Camaná 707', '2023-10-21', 1, 4, 0, 4, 4),
(11, '81234567', 'Miguel Angel', 'Salazar Pineda', 'miguel.salazar@empresa.com', '987654331', 'Av. Tacna 808', '2023-11-03', 1, 4, 0, 4, 4),

-- EQUIPO B: Liderado por ROBERTO SANCHEZ (ID 6)
(6, '76789012', 'Roberto', 'Sanchez Lee', 'roberto.sanchez@empresa.com', '999888777', 'Av. Brasil 500', '2023-06-01', 1, 4, 1, NULL, 3),
(12, '82345678', 'Lucia', 'Ramirez Soto', 'lucia.ramirez@empresa.com', '987654332', 'Calle Grau 909', '2023-12-16', 1, 4, 0, 6, 4),
(13, '83456789', 'Fernando', 'Gutierrez León', 'fernando.gutierrez@empresa.com', '987654333', 'Av. Salaverry 1010', '2024-01-29', 1, 4, 0, 6, 4),
(14, '84567890', 'Silvia', 'Chavez Muñoz', 'silvia.chavez@empresa.com', '987654334', 'Jr. Lampa 1111', '2024-02-11', 1, 4, 0, 6, 4),

-- EQUIPO C: Liderado por DIEGO ROJAS (ID 8)
(8, '78901234', 'Diego', 'Rojas Quispe', 'diego.rojas@empresa.com', '999444555', 'Av. Larco 456', '2023-08-20', 1, 4, 1, NULL, 3),
(15, '85678901', 'Ricardo', 'Morales Paz', 'ricardo.morales@empresa.com', '987654335', 'Av. Ejercito 1212', '2024-03-24', 1, 4, 0, 8, 4),
(16, '86789012', 'Elena', 'Paredes Mori', 'elena.paredes@empresa.com', '987654336', 'Jr. Junín 333', '2024-03-25', 1, 4, 0, 8, 4),

-- Otros perfiles (Presenciales/Remotos)
(2, '72345678', 'Maria Elena', 'Gomez Ruiz', 'maria.gomez@empresa.com', '987654322', 'Jr. de la Unión 456', '2023-02-10', 1, 2, 0, NULL, 2),
(3, '73456789', 'Luis Miguel', 'Torres Silva', 'luis.torres@empresa.com', '987654323', 'Av. Javier Prado 789', '2023-03-22', 1, 3, 0, NULL, 2);

-- 5. USUARIOS (Password: 123456 para todos)
INSERT INTO usuarios (id, username, password, rol_id, trabajador_id, activo) VALUES
(1, 'admin', '123456', 1, 1, 1),
(2, 'aflores', '123456', 3, 4, 1), -- Jefe A
(3, 'rsanchez', '123456', 3, 6, 1), -- Jefe B
(4, 'drojas', '123456', 3, 8, 1),   -- Jefe C
(5, 'cvargas', '123456', 4, 5, 1),  -- Equipo A
(6, 'pherrera', '123456', 4, 10, 1), -- Equipo A
(7, 'msalazar', '123456', 4, 11, 1), -- Equipo A
(8, 'lramirez', '123456', 4, 12, 1), -- Equipo B
(9, 'fgutierrez', '123456', 4, 13, 1), -- Equipo B
(10, 'schavez', '123456', 4, 14, 1), -- Equipo B
(11, 'rmorales', '123456', 4, 15, 1), -- Equipo C
(12, 'eparedes', '123456', 4, 16, 1), -- Equipo C
(13, 'mgomez', '123456', 2, 2, 1),
(14, 'ltorres', '123456', 2, 3, 1);

-- 6. PUNTOS EN TERRENO (Ubicaciones iniciales de los Jefes)
INSERT INTO puntos_terreno (id, latitud, longitud, nombre_ubicacion, fecha_actualizacion, actualizado_por_id) VALUES
(1, -12.115000, -77.025000, 'Obra San Isidro - Torre A', '2024-03-01 08:00:00', 4), -- Jefe A
(2, -12.045000, -77.015000, 'Planta Industrial Norte', '2024-03-01 08:30:00', 6),   -- Jefe B
(3, -12.145000, -77.015000, 'Almacén Principal Chorrillos', '2024-03-01 09:00:00', 8); -- Jefe C

-- 7. Comunicados
INSERT INTO comunicados (id, titulo, contenido, fecha_publicacion, activo, autor_id) VALUES
(1, 'Nuevos Puntos de Terreno', 'Se han habilitado 3 nuevas zonas de trabajo en campo.', '2024-04-01 09:00:00', 1, 1),
(2, 'Protocolo de Seguridad', 'Es obligatorio el uso de EPP en todas las zonas de terreno.', '2024-04-02 10:00:00', 1, 1);

SET FOREIGN_KEY_CHECKS = 1;
