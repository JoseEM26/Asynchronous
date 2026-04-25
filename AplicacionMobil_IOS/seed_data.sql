-- SEED DATA - ASISTENCIA HIBRIDA (REPARADO)
-- Este script inserta datos de prueba iniciales.
-- He movido la activación de llaves foráneas al final para evitar errores intermedios.

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

-- 3. Roles (IDs oficiales)
INSERT INTO roles (id, nombre) VALUES 
(1, 'ADMIN'), 
(2, 'TRABAJADOR'),
(3, 'JEFE_TERRENO'),
(4, 'TRABAJADOR_TERRENO'),
(5, 'SUPER_ADMIN');

-- 4. Modalidades (IDs oficiales)
INSERT INTO modalidades (id, nombre) VALUES 
(1, 'PRESENCIAL'), 
(2, 'VIRTUAL / REMOTO'), 
(3, 'HIBRIDO'), 
(4, 'TERRENO'),
(5, 'EXENTO / ADMINISTRATIVO');

-- 5. Configuración
INSERT INTO configuracion (id, office_lat, office_lng, radius) VALUES 
(1, -12.046374, -77.042793, 50);

-- 6. Trabajadores
INSERT INTO trabajadores (id, dni, nombres, apellidos, email, telefono, direccion, fecha_ingreso, activo, modalidad_id, es_jefe_terreno, latitud_virtual, longitud_virtual, dias_presencial) VALUES
(1, '71234567', 'Juan Carlos', 'Perez Gonzales', 'juan.perez@empresa.com', '987654321', 'Av. Arequipa 123, Lima', '2023-01-15', 1, 1, 0, NULL, NULL, NULL),
(2, '72345678', 'Maria Elena', 'Gomez Ruiz', 'maria.gomez@empresa.com', '987654322', 'Jr. de la Unión 456, Lima', '2023-02-10', 1, 2, 0, -12.055000, -77.035000, NULL),
(3, '73456789', 'Luis Miguel', 'Torres Silva', 'luis.torres@empresa.com', '987654323', 'Av. Javier Prado 789, San Isidro', '2023-03-22', 1, 3, 0, -12.095000, -77.025000, 'Lunes,Miercoles'),
(4, '74567890', 'Ana Maria', 'Flores Castro', 'ana.flores@empresa.com', '987654324', 'Calle Los Pinos 101, Miraflores', '2023-04-05', 1, 4, 1, NULL, NULL, NULL),
(5, '75678901', 'Carlos Jose', 'Vargas Mendoza', 'carlos.vargas@empresa.com', '987654325', 'Av. La Marina 202, San Miguel', '2023-05-18', 1, 1, 0, NULL, NULL, NULL);

-- 7. Usuarios (Password: 123456)
INSERT INTO usuarios (id, username, password, rol_id, trabajador_id, activo) VALUES
(1, 'admin', '123456', 1, NULL, 1),
(2, 'jperez', '123456', 2, 1, 1),
(3, 'mgomez', '123456', 2, 2, 1),
(4, 'ltorres', '123456', 2, 3, 1),
(5, 'aflores', '123456', 3, 4, 1),
(6, 'cvargas', '123456', 4, 5, 1);

-- 8. Asistencias
INSERT INTO asistencias (id, trabajador_id, fecha_hora, tipo, modalidad_id, latitud, longitud, notas) VALUES
(1, 1, '2024-03-01 08:00:00', 'ENTRADA', 1, -12.046374, -77.042793, 'Ingreso a tiempo oficina'),
(2, 2, '2024-03-01 08:10:00', 'ENTRADA', 2, -12.055010, -77.035020, 'Ingreso virtual desde casa');

-- 9. Puntos en Terreno
INSERT INTO puntos_terreno (id, latitud, longitud, nombre_ubicacion, fecha_actualizacion, actualizado_por_id) VALUES
(1, -12.115000, -77.025000, 'Obra Sector Sur', '2024-03-01 08:00:00', 4),
(2, -12.125000, -77.035000, 'Obra Sector Norte', '2024-03-01 08:00:00', 4);

-- 10. Reactivar checks al final
SET FOREIGN_KEY_CHECKS = 1;
