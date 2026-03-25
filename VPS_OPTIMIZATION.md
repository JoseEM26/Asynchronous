# Guía de Optimización para VPS Oracle Cloud (1GB RAM)

Dado que tu servidor tiene solo 1GB de RAM, es **crítico** limitar el consumo de la Máquina Virtual de Java (JVM) para evitar que el sistema operativo mane el proceso (Out Of Memory Killer) o use "swap", lo cual ralentiza todo.

## 1. Comando de Arranque Recomendado

Cuando corras tu aplicación (`.jar`), utiliza estos parámetros para forzar un consumo eficiente de memoria:

```bash
java -Xmx448m -Xms256m -XX:+UseG1GC -XX:MaxMetaspaceSize=128m -jar tu-aplicacion.jar
```

### Explicación de los parámetros:
*   `-Xmx448m`: Limita la memoria máxima del "Heap" a 448MB. Esto deja suficiente espacio para el sistema operativo y el buffer de base de datos en los 1GB totales.
*   `-Xms256m`: Inicia la aplicación con 256MB de memoria reservada.
*   `-XX:+UseG1GC`: Utiliza el recolector de basura G1, que es más eficiente en latencia para aplicaciones interactivas.
*   `-XX:MaxMetaspaceSize=128m`: Evita que la carga de clases crezca indefinidamente.

## 2. Optimización de Base de Datos (MySQL)

Si MySQL corre en el mismo VPS, te recomiendo ajustar `/etc/mysql/my.cnf` para que no use demasiada RAM:

```ini
[mysqld]
key_buffer_size = 16M
max_connections = 20
innodb_buffer_pool_size = 128M
innodb_log_size = 32M
```

## 3. Desactivar DevTools en Producción
Asegúrate de que no estás incluyendo `spring-boot-devtools` en el paquete final de producción. Al construir el JAR usa:

```bash
mvn clean package -DskipTests
```
