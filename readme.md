# Proyecto (Docker Compose): Backend + Frontend + MongoDB

Este repositorio define una aplicación compuesta por **tres servicios** orquestados con **Docker Compose**:

- **backend**: servidor Node.js (construido desde `./backend`)
- **frontend**: servidor web **Nginx** que sirve contenido estático desde `./frontend`
- **mongo**: base de datos **MongoDB** con persistencia en volumen

El archivo principal de orquestación es `docker-compose.yml`.

## Estructura del proyecto (a alto nivel)

```text
.
├── Readme.md
├── docker-compose.yml
├── backend/
│   └── Dockerfile (y código del backend)
│   └── package.json
│   └── server.js
└── frontend/
    └── index.html
    └── app.js
```

> Nota: según el `docker-compose.yml`, el frontend **no se construye con Dockerfile**; usa directamente la imagen oficial de Nginx y monta la carpeta `./frontend` dentro del contenedor.

## Servicios definidos

### 1) backend (Node.js)

- **Build**: se construye desde `./backend`:
  - `build: ./backend`
- **Puertos**:
  - Host `3000` → Contenedor `3000` (`"3000:3000"`)
- **Dependencias**:
  - `depends_on: mongo` (arranca después de Mongo)
- **Red**:
  - Conectado a `app-network` para comunicarse con Mongo usando el nombre del servicio `mongo`.

**Cómo se accede**
- Desde tu máquina: `http://localhost:3000`

### 2) frontend (Nginx)

- **Imagen**:
  - `nginx:mainline-alpine3.23-perl`
- **Volumen (bind mount)**:
  - `./frontend` → `/usr/share/nginx/html/`
  - Esto hace que los archivos estáticos del directorio `frontend/` se sirvan directamente por Nginx, y cualquier cambio local se refleje en el contenedor.
- **Puertos**:
  - Host `8080` → Contenedor `80` (`"8080:80"`)
- **Dependencias**:
  - `depends_on: backend`

**Cómo se accede**
- Desde tu máquina: `http://localhost:8080`

**Nota de red**
- En el compose hay comentarios indicando que **no es necesario** conectar el frontend a la red `app-network` (de hecho está comentado), porque:
  - El navegador del usuario es quien llama al backend vía `localhost:3000` (o la URL que corresponda),
  - y exponer Nginx a la misma red interna puede ser innecesario o incluso mala práctica en ciertos escenarios.

### 3) mongo (MongoDB)

- **Imagen**:
  - `mongo:6.0`
- **Puertos**:
  - Host `27017` → Contenedor `27017` (`"27017:27017"`)
- **Persistencia**:
  - Usa un volumen Docker llamado `mongo-data` montado en `/data/db`
  - Así los datos **no se pierden** al reiniciar/eliminar el contenedor.
- **Red**:
  - Conectado a `app-network`

**Cómo se accede**
- Desde tu máquina: `mongodb://localhost:27017`
- Desde el backend dentro de Docker: `mongodb://mongo:27017` (por DNS interno de Compose usando el nombre del servicio `mongo`)

## Volúmenes

### `mongo-data`

En el bloque:

- `volumes:`
  - `mongo-data:`

Se declara un volumen administrado por Docker para persistir la base de datos de MongoDB fuera del ciclo de vida del contenedor.

## Redes

### `app-network` (bridge)

Se define una red personalizada:

- `app-network:`
  - `driver: bridge`

Esto permite que los contenedores conectados a esa red se comuniquen entre sí usando los **nombres de servicio** como hostnames (por ejemplo, `mongo`).

## Puertos expuestos (resumen)

| Servicio  | En el host | En el contenedor | Uso |
|----------|------------:|-----------------:|-----|
| frontend | `8080`       | `80`             | Web estática (Nginx) |
| backend  | `3000`       | `3000`           | API/servidor Node |
| mongo    | `27017`      | `27017`          | Base de datos MongoDB |

## Cómo levantar el proyecto

Desde la raíz del repositorio (donde está `docker-compose.yml`):

```bash
docker compose up --build
```

Para ejecutarlo en segundo plano:

```bash
docker compose up -d --build
```

Para parar y eliminar contenedores (sin borrar volumen):

```bash
docker compose down
```

Para parar y eliminar contenedores **y** borrar los datos de Mongo (volumen):

```bash
docker compose down -v
```