# SIOX - Sistema Integral Oaxaca

Sistema de contabilidad gubernamental para el estado de Oaxaca. Incluye modulos CONAC (Plan de Cuentas) y CRI (Clasificador por Rubro de Ingreso).

## Estructura del Proyecto

```
siox/
├── oax_ms_siox_perfilamiento-main/    # Backend - Autenticacion y usuarios
├── oax_ms_siox_cat_conac_cri-main/    # Backend - Catalogos CONAC/CRI
└── oax_ms_siox_front_interno-main/    # Frontend Angular
```

## Requisitos

- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

## Configuracion de Base de Datos

El proyecto utiliza PostgreSQL con la siguiente configuracion para desarrollo:

```
Host:     98.93.119.88
Puerto:   5432
Database: siox_db
Schema:   siox
Usuario:  admin
Password: admin123
```

## Levantar el Proyecto (Desarrollo)

### 1. Backend Perfilamiento (Puerto 9292)

```bash
cd oax_ms_siox_perfilamiento-main
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 2. Backend Catalogos (Puerto 9293)

```bash
cd oax_ms_siox_cat_conac_cri-main
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 3. Frontend (Puerto 4200)

```bash
cd oax_ms_siox_front_interno-main
npm install
npm start
```

Acceder en: http://localhost:4200

## Credenciales de Acceso

```
Correo:   oaxaca@dominio.com
Password: Admin11+
Codigo 2FA: 000000
```

Nota: El codigo 2FA "000000" solo funciona en el perfil de desarrollo.

## Modulos Principales

### CONAC - Plan de Cuentas
- Genero
- Grupo
- Rubro
- Cuenta
- Subcuenta
- Datos de Cuenta (Naturaleza, Estado Financiero, Posicion, Estructura)

### CRI - Clasificador por Rubro de Ingreso
- Rubro
- Tipo
- Clase
- Concepto

### Domicilio
- Pais, Estados, Regiones, Distritos
- Municipios, Localidades
- Tipos de Asentamiento, Vialidades

## Arquitectura

- **Frontend**: Angular 18 con NG-ZORRO (Ant Design)
- **Backend**: Spring Boot 3.x con Spring Security
- **Base de Datos**: PostgreSQL
- **Autenticacion**: JWT + 2FA (Google Authenticator)

## Ramas

- `main` - Produccion
- `develop` - Desarrollo

## API Documentation

Con los backends corriendo, acceder a Swagger UI:
- Perfilamiento: http://localhost:9292/swagger-ui.html
- Catalogos: http://localhost:9293/swagger-ui.html
