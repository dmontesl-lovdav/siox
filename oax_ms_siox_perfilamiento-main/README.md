# SIOX Perfilamiento - Microservicio de Autenticación

Sistema de autenticación con doble factor (2FA) usando Microsoft Authenticator para el sistema SIOX.

## Características

- ✅ Autenticación con correo y contraseña
- ✅ Autenticación de doble factor (2FA) con TOTP
- ✅ Compatible con Microsoft Authenticator
- ✅ Generación de códigos QR para configuración 2FA
- ✅ Tokens JWT para sesiones
- ✅ API RESTful
- ✅ Arquitectura en capas (Controller, Service, Repository, Entity)

## Tecnologías

- Java 17
- Spring Boot 2.7.0
- Spring Security
- Spring Data JPA
- MySQL
- JWT (JSON Web Tokens)
- Google Authenticator (TOTP)
- ZXing (Generación de códigos QR)
- Lombok
- Maven

## Requisitos previos

- JDK 17
- Maven 3.6+
- MySQL 8.0+

## Configuración de la base de datos

1. Crear la base de datos:

```sql
CREATE DATABASE siox_perfilamiento CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Configurar las credenciales en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/siox_perfilamiento
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

## Instalación y Configuración

### 1. Prerrequisitos

- **Java 21** (OpenJDK 21 o superior) - **IMPORTANTE: Debe ser Java 21**
- Maven 3.6+
- MySQL 8.0+

### 2. Verificar Java 21

```bash
# Listar versiones de Java instaladas
/usr/libexec/java_home -V

# Debe aparecer algo como:
# 21.0.8 (x86_64) "Eclipse Adoptium" - "OpenJDK 21.0.8" /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
```

Si no tienes Java 21, descárgalo desde: https://adoptium.net/

### 3. Configuración de Base de Datos

```sql
CREATE DATABASE siox_perfilamiento;
```

Ejecutar el script `database.sql` incluido en el proyecto:

```bash
mysql -u root -p siox_perfilamiento < database.sql
```

### 4. Configuración de Variables

Editar `src/main/resources/application.properties`:

```properties
# Base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/siox_perfilamiento
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password

# JWT (cambiar en producción)
jwt.secret=tu_secret_key_super_seguro_de_al_menos_256_bits
```

### 5. Compilar y Ejecutar

**Opción A - Usando el script (Recomendado):**

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x build.sh

# Compilar e instalar
./build.sh install

# Ejecutar
./build.sh run
```

**Opción B - Usando Maven directamente:**

```bash
# Configurar Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

# Compilar
mvn clean install

# Ejecutar
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

### 6. Solución de Problemas

Si ves errores en el IDE pero Maven compila correctamente, consulta el archivo `SOLUCION_ERRORES.md` para resolver problemas de sincronización entre el IDE y Maven.

## Endpoints de la API

### Autenticación

#### 1. Registro de usuario
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "sNombre": "",
  "aPaterno": "Salgado",
  "aMaterno": "Martinez",
  "correo": "juan@example.com",
  "password": "password123",
  "idLicencia": 1
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "juan@example.com",
  "password": "password123"
}
```

**Respuesta si NO tiene 2FA configurado:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "idUsuario": 1,
    "correo": "juan@example.com",
    "nombre": "Juan Carlos Salgado",
    "requires2FA": false
  }
}
```

**Respuesta si tiene 2FA configurado:**
```json
{
  "success": true,
  "message": "Validación 2FA requerida",
  "data": {
    "correo": "juan@example.com",
    "requires2FA": true,
    "message": "Se requiere código de autenticación de dos factores"
  }
}
```

#### 3. Configurar autenticación de dos factores
```http
POST /api/auth/configurar-2fa?correo=juan@example.com
```

**Respuesta:**
```json
{
  "success": true,
  "message": "2FA configurado exitosamente",
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "manualEntryKey": "JBSW Y3DP EHPK 3PXP"
  }
}
```

#### 4. Verificar código 2FA
```http
POST /api/auth/verificar-2fa
Content-Type: application/json

{
  "correo": "juan@example.com",
  "totpCode": "123456"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "type": "Bearer",
    "idUsuario": 1,
    "correo": "juan@example.com",
    "nombre": "Juan Carlos Salgado",
    "requires2FA": false
  }
}
```

#### 5. Health check
```http
GET /api/auth/health
```

## Flujo de autenticación con 2FA

1. **Usuario se registra** → `POST /api/auth/registro`
2. **Usuario hace login** → `POST /api/auth/login`
   - Si no tiene 2FA: Recibe token JWT directamente
   - Si tiene 2FA: Recibe mensaje indicando que debe verificar
3. **Configurar 2FA (opcional)** → `POST /api/auth/configurar-2fa`
   - Escanear QR con Microsoft Authenticator
   - O ingresar la clave manual
4. **Verificar código 2FA** → `POST /api/auth/verificar-2fa`
   - Ingresar el código de 6 dígitos del Authenticator
   - Recibe token JWT

## Estructura del proyecto

```
src/main/java/com/oaxaca/
├── OaxMsSioxPerfilamientoApplication.java
├── config/
│   ├── SecurityConfig.java
│   └── DateConfiguration.java
├── controller/
│   └── AuthController.java
├── dto/
│   ├── ApiResponseDTO.java
│   ├── AuthResponseDTO.java
│   ├── LoginRequestDTO.java
│   ├── RegistroUsuarioDTO.java
│   ├── TwoFactorSetupDTO.java
│   └── TwoFactorVerifyDTO.java
├── entity/
│   ├── CatEntrefes.java
│   ├── CatPermisos.java
│   ├── Siox.java
│   ├── TblPaginas.java
│   ├── TblRoles.java
│   └── TblUsuarios.java
├── repository/
│   ├── CatEntrefesRepository.java
│   ├── CatPermisosRepository.java
│   ├── SioxRepository.java
│   ├── TblPaginasRepository.java
│   ├── TblRolesRepository.java
│   └── TblUsuariosRepository.java
├── service/
│   ├── AuthService.java
│   ├── TwoFactorAuthService.java
│   └── impl/
│       ├── AuthServiceImpl.java
│       └── TwoFactorAuthServiceImpl.java
└── util/
    └── JwtUtil.java
```

## Modelo de datos

El sistema utiliza las siguientes tablas basadas en el diagrama proporcionado:

- **siox**: Tabla principal de licencias
- **tbl_usuarios**: Usuarios del sistema
- **tbl_roles**: Roles asignados a usuarios
- **tbl_paginas**: Relación entre roles y páginas
- **cat_permisos**: Catálogo de permisos
- **cat_entrefes**: Catálogo de entrefes

## Seguridad

- Las contraseñas se almacenan encriptadas con BCrypt
- Los tokens JWT tienen una expiración de 24 horas
- Los secretos 2FA se almacenan de forma segura en la base de datos
- CORS configurado para aceptar peticiones de cualquier origen (configurar en producción)

## Configuración del Microsoft Authenticator

1. Abre la app Microsoft Authenticator en tu móvil
2. Toca el ícono "+" para agregar una cuenta
3. Selecciona "Otra cuenta (Google, Facebook, etc.)"
4. Escanea el código QR proporcionado por `/api/auth/configurar-2fa`
5. Alternativamente, ingresa la clave manual proporcionada

## Desarrollo

### Compilar sin ejecutar tests
```bash
mvn clean install -DskipTests
```

### Ejecutar en modo desarrollo
```bash
mvn spring-boot:run
```

## Autor

Sistema SIOX - Gobierno del Estado de Oaxaca

## Licencia

Uso interno del Gobierno del Estado de Oaxaca
