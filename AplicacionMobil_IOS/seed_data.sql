-- SEED DATA - ASISTENCIA HIBRIDA (AMPLIADO)
-- Este script inserta datos de prueba iniciales para todos los roles.

USE asistencia_db;

-- 1. Desactivar checks para limpieza e inserción masiva
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Limpiar todas las tablas
TRUNCATE TABLE asistencias;
TRUNCATE TABLE puntos_terreno;
TRUNCATE TABLE usuarios;
TRUNCATE TABLE trabajadores;
TRUNCATE TABLE modalidades;
TRUNCATE TABLE roles;
TRUNCATE TABLE configuracion;
TRUNCATE TABLE comunicados;

-- 3. Roles
INSERT INTO roles (id, nombre) VALUES 
(1, 'ADMIN'), 
(2, 'TRABAJADOR'),
(3, 'JEFE_TERRENO'),
(4, 'TRABAJADOR_TERRENO'),
(5, 'SUPER_ADMIN');

-- 4. Modalidades
INSERT INTO modalidades (id, nombre) VALUES 
(1, 'PRESENCIAL'), 
(2, 'VIRTUAL / REMOTO'), 
(3, 'HIBRIDO'), 
(4, 'TERRENO'),
(5, 'EXENTO / ADMINISTRATIVO');

-- 5. Configuración Central
INSERT INTO configuracion (id, office_lat, office_lng, radius) VALUES 
(1, -12.046374, -77.042793, 100);

-- 6. Trabajadores (Variedad de perfiles)
INSERT INTO trabajadores (id, dni, nombres, apellidos, email, telefono, direccion, fecha_ingreso, activo, modalidad_id, es_jefe_terreno, latitud_virtual, longitud_virtual, dias_presencial) VALUES
(1, '71234567', 'Juan Carlos', 'Perez Gonzales', 'juan.perez@empresa.com', '987654321', 'Av. Arequipa 123', '2023-01-15', 1, 1, 0, NULL, NULL, NULL),
(2, '72345678', 'Maria Elena', 'Gomez Ruiz', 'maria.gomez@empresa.com', '987654322', 'Jr. de la Unión 456', '2023-02-10', 1, 2, 0, -12.055, -77.035, NULL),
(3, '73456789', 'Luis Miguel', 'Torres Silva', 'luis.torres@empresa.com', '987654323', 'Av. Javier Prado 789', '2023-03-22', 1, 3, 0, -12.095, -77.025, 'Lunes,Miercoles,Viernes'),
(4, '74567890', 'Ana Maria', 'Flores Castro', 'ana.flores@empresa.com', '987654324', 'Calle Los Pinos 101', '2023-04-05', 1, 4, 1, NULL, NULL, NULL),
(5, '75678901', 'Carlos Jose', 'Vargas Mendoza', 'carlos.vargas@empresa.com', '987654325', 'Av. La Marina 202', '2023-05-18', 1, 4, 0, NULL, NULL, NULL),
(6, '76789012', 'Roberto', 'Sanchez Lee', 'roberto.sanchez@empresa.com', '999888777', 'Av. Brasil 500', '2023-06-01', 1, 5, 0, NULL, NULL, NULL),
(7, '77890123', 'Patricia', 'Luna Ramos', 'patricia.luna@empresa.com', '999111222', 'Calle Alcanfores 321', '2023-07-12', 1, 4, 1, NULL, NULL, NULL),
(8, '78901234', 'Diego', 'Rojas Quispe', 'diego.rojas@empresa.com', '999444555', 'Av. Larco 456', '2023-08-20', 1, 4, 0, NULL, NULL, NULL);

-- 7. Usuarios (TODOS CON PASSWORD: 123456)
INSERT INTO usuarios (id, username, password, rol_id, trabajador_id, activo) VALUES
(1, 'admin', '123456', 1, NULL, 1),
(2, 'jperez', '123456', 2, 1, 1),
(3, 'mgomez', '123456', 2, 2, 1),
(4, 'ltorres', '123456', 2, 3, 1),
(5, 'aflores', '123456', 3, 4, 1), -- Jefe Terreno 1
(6, 'cvargas', '123456', 4, 5, 1), -- Trabajador Terreno (bajo aflores)
(7, 'rsanchez', '123456', 5, 6, 1), -- SUPER_ADMIN
(8, 'pluna', '123456', 3, 7, 1),    -- Jefe Terreno 2
(9, 'drojas', '123456', 4, 8, 1);    -- Trabajador Terreno (bajo pluna)

-- 8. Comunicados Iniciales
INSERT INTO comunicados (id, titulo, contenido, fecha_publicacion, activo, autor_id) VALUES
(1, 'Bienvenidos a Geocheck', 'Este es el nuevo sistema de asistencia hibrida unificada.', '2024-03-01 09:00:00', 1, 1),
(2, 'Actualización de App', 'Recuerden actualizar su app móvil a la versión 2.0.', '2024-03-02 10:00:00', 1, 1);

-- 9. Puntos en Terreno (Establecidos por los Jefes)
INSERT INTO puntos_terreno (id, latitud, longitud, nombre_ubicacion, fecha_actualizacion, actualizado_por_id) VALUES
(1, -12.115000, -77.025000, 'Obra San Isidro - Torre A', '2024-03-01 08:00:00', 4), -- Por aflores
(2, -12.125000, -77.035000, 'Obra Miraflores - Sótano', '2024-03-01 08:00:00', 7); -- Por pluna

-- 10. Reactivar checks al final
SET FOREIGN_KEY_CHECKS = 1;
