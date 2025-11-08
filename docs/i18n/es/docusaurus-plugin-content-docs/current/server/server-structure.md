---
sidebar_position: 1
---

# Estructura del Servidor

El servidor esta construido utilizando **Typescript**, tiene un paradigma orientada en su mayoría a la programación funcional, aunque también se utilizan clases en ciertos módulos donde es necesario mantener estados o comportamientos específicos.

El proyecto se encuentra dentro del directorio `src`, dentro te encontrarás con la siguiente distribución de carpetas y archivos principales:

## Resumen de la estructura

```plaintext
src/
├── api-client/
├── app/
│   ├── alert/
│   ├── channel/
│   ├── devent/
│   ├── device/
│   ├── geofence/
│   ├── group/
│   ├── layer/
│   ├── notification/
│   ├── point-interest/
│   ├── route/
│   ├── rule/
│   ├── test-app/       # debe ser removido en futuras versiones
│   ├── track/
│   └── vehicle/
├── common/
│   ├── cache/
│   ├── kafka/
│   ├── log-db/
│   ├── redis/
│   ├── report/        # debe ser removido en futuras versiones
│   └── schema/
├── config/
├── docs/
├── routes/
├── server/
├── utils/
├── index.ts
├── app.ts
├── kafka-topics.ts
└── init-services.ts
```

Espero esto te sea util, lo mas importante es que entiendas donde se ubica cada modulo y su propósito dentro del sistema.

## Index.ts

Es el punto de entrada principal de la aplicación. Aquí se inicia el servidor rest y los servicios necesarios como Kafka, conexiones a bases de datos, etc.

## App.ts

Este archivo maneja la configuración principal de la aplicación util para el servicio rest.

## api-client

Contiene una abstracción para interactuar con los servicios de datos, pensado para extraer con facilidad la respuesta de la DB, y manejar los tipos correctamente.

## App

Es la carpeta mas extensa, contiene todos los paquetes o módulos necesarios para el procesamiento de los datos. Cada uno es independiente en gran medida, en su interior podrás encontrar:

### &nbsp;Alert

&nbsp;Contiene la lógica, dtos, schemas y servicios necesario para manejar y construir las alertas para **tracking-monitor**.

### &nbsp;Channel

&nbsp;Contiene la lógica, dtos, esquemas y servicios necesario para manejar los canales de notificación para enviar las notificaciones a los usuarios.

### &nbsp;Devent

&nbsp;Contiene la lógica, dtos, esquemas y servicios necesario para manejar los eventos y sensores que un dispositivo puede tener asignado.

### &nbsp;Device

&nbsp;Probablemente el modulo mas importante, aquí se encuentra la lógica principal para procesar los datos de tracking, asignar vehículos, grupos, interacción con geo-cercas y puntos de interés, etc.

### &nbsp;Geofence

&nbsp;Contiene la lógica, dtos, esquemas y servicios necesario para manejar las geo-cercas y su interacción con los dispositivos.

### &nbsp;Group

&nbsp;Contiene la lógica, dtos, esquemas y servicios necesario para manejar los grupos de vehículos y su asignación a los dispositivos.

### &nbsp;Layer

&nbsp;Contiene los dtos y esquemas necesarios para las capas de geo-cercas y puntos de interés.

### &nbsp;Notification

&nbsp;Contiene la lógica, dtos, esquemas y servicios necesario para manejar las notificaciones y su envío a los usuarios.

### &nbsp;Point-interest

&nbsp;Contiene la lógica, dtos, esquemas y servicios necesario para manejar los puntos de interés y su interacción con los dispositivos.

### &nbsp;Route

&nbsp;Contiene dtos y utiles para el manejo de rutas.

### &nbsp;Rule

&nbsp;El segundo paquete más importante, aquí se encuentra la lógica principal para procesar las reglas asignadas a los vehículos y grupos, verificar condiciones, disparar notificaciones, etc.

### &nbsp;Test-app

&nbsp;Este paquete es de pruebas, el código aquí no debería generar problemas, pero puede ser retirado en futuras versiones.

### &nbsp;Track

&nbsp;Contiene los dtos y esquemas necesarios para el manejo de los datos de tracking.

### &nbsp;Vehicle

&nbsp;Contiene la lógica, dtos, esquemas y servicios necesario para manejar los vehículos y su asignación a los dispositivos.

## Common

Contiene la inicialización de servicios para toda la aplicación, como Kafka, clickhouse, redis, cache incluyendo sus esquemas, dtos y servicios para un manejo mas sencillo por parte de los demás módulos.

## Config

Contiene configuración útil para toda la aplicación, como las variables de entorno, para que puedan ser accedidas desde cualquier módulo.

## Docs

Contiene la configuración de la documentación del API para su despliegue en Swagger. Fuera de `src` existirá otra carpeta `docs` en la raíz del proyecto, esta contendrá la documentación general del proyecto.

## Routes

Contiene la configuración de las rutas del servidor rest.

## Server

Contiene la configuración y servicios para crear el servidor express.

## Utils

Contiene utilidades generales que pueden ser usadas en cualquier módulo del proyecto.

## kafka-topics.ts

Contiene la definición de los tópicos de Kafka usados en el proyecto.

## init-services.ts

Contiene la inicialización modular de los servicios principales del proyecto, como Kafka, conexiones a bases de datos, etc.
