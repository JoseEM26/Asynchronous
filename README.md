# 🌍 GeoCheck AI - Sistema de Gestión de Asistencia Híbrida

![Banner](https://img.shields.io/badge/Status-Premium-orange?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Spring_Boot_%7C_Angular_%7C_Swift-blue?style=for-the-badge)

GeoCheck AI es una plataforma ecosistémica diseñada para el control de asistencia en entornos laborales modernos. Combina la potencia de un backend Robusto en Spring Boot, un panel administrativo elegante en Angular y una aplicación móvil nativa en iOS para cubrir todas las modalidades de trabajo: desde la oficina central hasta el trabajo de campo más remoto.

---

## 🚀 Módulos del Ecosistema

### 🖥️ Web Admin (Angular)
Panel de control centralizado con estética *Premium Dark/Light Mode*.
- **Gestión de Personal**: Control unificado de trabajadores y sus accesos.
- **Seguridad 2FA**: Autenticación de dos factores integrada con Google Authenticator/Authy.
- **Dashboard Dinámico**: Vistas personalizadas según el rol (Admin, Jefe de Terreno).
- **Configuración de Geofencing**: Definición de coordenadas de oficina y radio de tolerancia.

### 📱 App Móvil (Swift Native iOS)
Experiencia fluida y nativa para el trabajador en movimiento.
- **Marcación Inteligente**: Escaneo de QR seguro con rotación dinámica de tokens.
- **Marcación en Terreno**: Registro de asistencia basado en GPS para personal fuera de oficina.
- **Mapa Interactivo**: Herramienta para Jefes de Terreno para establecer puntos de control con un solo toque.
- **Historial**: Consulta de registros pasados con estados visuales.

### ⚙️ Backend API (Spring Boot)
El motor que impulsa todo el sistema.
- **Arquitectura RESTful**: Endpoints optimizados para Web y Móvil.
- **Seguridad**: Control de acceso basado en roles (RBAC).
- **Lógica de Negocio**: Validación de geocercas, horarios y tokens de seguridad.

---

## ⚖️ Reglas de Negocio (Business Rules)

### 👥 Jerarquía de Roles
1.  **ADMIN / SUPER_ADMIN**: Control total del sistema, gestión de personal y configuración global.
2.  **JEFE_TERRENO**: Supervisión de equipos de campo, visualización de personal a cargo y establecimiento de puntos de control móviles.
3.  **TRABAJADOR_TERRENO**: Marcación remota permitida mediante validación de GPS en puntos autorizados.
4.  **TRABAJADOR**: Personal estándar con marcación presencial o remota según su modalidad asignada.

### 🏢 Modalidades de Trabajo
- **PRESENCIAL**: Requiere estar dentro del radio de la oficina y escanear el QR activo.
- **VIRTUAL / REMOTO**: Permite marcación desde cualquier ubicación (Home Office).
- **HÍBRIDO**: Combina días de oficina (con geofence) y días remotos.
- **TERRENO**: Marcación exclusiva mediante botón de GPS. El trabajador debe estar en el punto señalado por su Jefe de Terreno.

### 🔐 Seguridad y Acceso
- **Bloqueo de Cuenta**: Si un administrador inhabilita a un usuario en la web, pierde el acceso instantáneamente tanto en la web como en la app móvil.
- **Geofencing**: El sistema calcula la distancia entre el trabajador y el punto de control. Si supera el radio de tolerancia, la asistencia es rechazada (salvo en modalidad Virtual).
- **2FA Obligatorio**: Los administradores deben confirmar su identidad mediante un código OTP de 6 dígitos en la plataforma web.

---

## 🛠️ Stack Tecnológico

- **Frontend**: Angular 17+, Bootstrap 5, CSS Moderno con variables personalizadas.
- **Mobile**: Swift 5, MapKit, CoreLocation, URLSession.
- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Hibernate.
- **Database**: MySQL / MariaDB / Supabase.

---

## 📦 Instalación Rápida

1.  **Backend**:
    ```bash
    cd AplicacionMobil_IOS
    ./mvnw spring-boot:run
    ```
2.  **Frontend**:
    ```bash
    cd asistencia_front
    npm install
    ng serve
    ```
3.  **Mobile**:
    - Abrir `IOS_mobil.xcodeproj` en Xcode.
    - Asegurarse de que el `NetworkManager.swift` apunte a la URL correcta de la API.
    - Compilar y ejecutar en un Simulador o Dispositivo Físico.

---

**Desarrollado con ❤️ para la gestión moderna de equipos.**
