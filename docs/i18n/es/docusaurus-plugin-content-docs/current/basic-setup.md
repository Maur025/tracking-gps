---
sidebar_position: 3
---

# Configuración Básica

A continuación te explicaré como configurar y ejecutar el proyecto, para que puedas tenerlo funcionando en tu entorno local de desarrollo.

## Requisitos Previos

Antes de comenzar, revisa si tienes instalado lo siguiente:

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io/es/) (se puede usar npm, pero el proyecto esta pensado para funcionar con pnpm, veras que ofrece mejores funcionalidades para manejar dependencias)
- [Docker](https://www.docker.com/) (opcional, pero recomendado para correr servicios como Kafka y Redis)

## Clonar el Repositorio

Clona el repositorio del proyecto desde GitHub:

```bash
git clone git@github.com:Maur025/tracking-gps.git
```

Navega al directorio del proyecto:

```bash
cd tracking-gps
```

## Instalar Dependencias

Instala las dependencias del proyecto usando pnpm:

```bash
pnpm install
```

## Configurar Variables de Entorno

Veras que en la raíz del proyecto existe un archivo llamado `.env.example`, este archivo contiene las variable de entorno necesarias para que el proyecto funcione, duplica y renombra este archivo a `.env` para correr el servidor normalmente y a `env.test` para correr las pruebas de integración.

```text
STATIC_PATH=public                    # ruta de archivos estáticos
HOST=localhost                        # dirección del host
PORT=3000                             # puerto del servidor

BACKEND_URL=http://localhost:3001     # URL del servidor tracking-db
TRACK_URL=http://localhost:3002       # URL del servidor de tracking-capture
LOG_LEVEL=warn                        # nivel de logs (error, warn, info, debug, silly)
LOG_PATH=logs                         # ruta del archivo de logs

REDIS_HOST=localhost
REDIS_PORT=6379

KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=tracking-gps
KAFKA_LOG_LEVEL=INFO

CLICKHOUSE_HOST=http://localhost
CLICKHOUSE_PORT=8123
CLICKHOUSE_DB=your-db
CLICKHOUSE_USER=your-user
CLICKHOUSE_PASSWORD=your-password-here

NOTIFICATION_URL=http://localhost:7768    # URL del servidor de notificaciones
GPS_RADIUS=2.5                            # radio en metros para ajustar la precision
MAX_METERS_PER_SECOND=100                 # Limite de metros por cada segundo
OSRM_URL=http://localhost:5000            # URL del servidor OSRM
```

Te encontraras algo parecido a esto, te explico rápidamente para que sirven, las variables al inicio son para configurar el servidor, las siguientes son para conectar con db, capture, logging configuración, el 3er bloque es para configurar redis, el 4to es para configurar kafka, el 5to es para configurar clickhouse y el ultimo bloque es para configurar el servidor de notificaciones, servidor de OSRM y parámetros de tracking.

## Iniciar servicios

Te indicaré como levantar los servicios para que el servidor funcione correctamente, si ya los tienes puedes saltarte este paso.

### Servicios de terceros

Lamentablemente existe un factor que sale de mis manos al momento de levantar el proyecto, son los servidores de kafka y DB externos y parte de los micro-servicios, no están bajo mi control, y probablemente tampoco estarán bajo el tuyo, para que puedas correr el proyecto debes preguntar en que host y puerto están corriendo estos servicios, para que puedas consumir los datos correctamente.

### Kafka

Te dejare un archivo docker-compose.yml en la carpeta `containers/kafka` para que lo puedas usar, pero en general el servicio de kafka lo tendrás corriendo en otra maquina o servidor, pregunta al equipo cual es el host, puerto y tópico correcto para que puedas recibir los datos desde capture, puedes levantar tu propia instancia de kafka, pero no recibirás datos, tendrías que publicarlos desde otra fuente, el archivo te servirá para configurar el entorno de pruebas de integración.

Puedes usar el archivo como lo encuentres o puedes modificar lo básico, como los puertos y lo que se te ocurra, luego ejecuta el comando:

```bash
docker-compose up -d
```

Si todo va bien tendrás disponible kafka en `localhost:9092`, o el puerto que definiste.

### Redis

Para correr redis usa el contenedor que te deje en `containers/redis`, con este notarás que también existe `containers/redis-test`, lo deje listo para las pruebas de integración, esto es mas sencillo, solo navega a la carpeta y ejecuta el comando:

```bash
docker-compose up -d
```

Redis si lo puedes levantar por tu cuenta, pero necesitarás datos para llenarlo.

### Clickhouse

En la versión actual del proyecto, debes tener clickhouse corriendo, ya que forma parte del proceso de control de reglas, hacer que funcione será fácil, te deje 2 contenedores en `containers/clickhouse` y `containers/clickhouse-test`, debes hacer lo mismo que con los otros contenedores, navega a la carpeta y ejecuta:

```bash
docker-compose up -d
```

Con estos simples pasos tendrás clickhouse corriendo en `localhost:8123`, o el puerto que definas.

## Iniciar el Servidor

Inicia el servidor de desarrollo:

```bash
pnpm run dev
```

El servidor debería estar corriendo en `http://localhost:7767` por defecto, si configuraste otro puerto, asegúrate de acceder a la URL correcta.

### Otros comandos útiles

Para correr las pruebas unitarias:

```bash
pnpm test
```

Para correr las pruebas de integración:

```bash
pnpm test:integration
```

Para revisar el código con el linter:

```bash
pnpm lint
```

Para construir el proyecto para producción:

```bash
pnpm build
```

Para iniciar el servidor desde la versión construida:

```bash
pnpm start
```

## Errores Comunes

- Revisa las variables de entorno para que el proyecto pueda conectarse a los servicios externos.

- Si vees lo siguiente en algún servicio:

  ```bash
  Error: connect ECONNREFUSED
  ```

  Lo mas probable es que el servicio no este corriendo o no se pueda conectar, revisa que el host y puerto sean correctos.

- Si usaste npm en lugar de pnpm, si todo va bien perfecto, pero si llegas a tener problemas con las versiones de las dependencias, intenta usar pnpm.

- Si ejecutaste el test de integración y falla, revisa que tengas el archivo `.env.test` con los valores correctamente configurados.

- Si vees lo siguiente:

  ```bash
  [2025-11-07 16:10:33] [ERROR]: [KAFKA] Connection error: connect ECONNREFUSED
  ```

  Esto es el tipo de error que lanza el logger personalizado, revisa las causas... intenté que sea fácil rastrear el error, notarás que entre corchetes indica el módulo o componente al que pertenece el error, en algunos logs notarás que entre paréntesis te indica la función o método donde ocurrió el error, esto te ayudará a rastrear el problema más fácilmente.
