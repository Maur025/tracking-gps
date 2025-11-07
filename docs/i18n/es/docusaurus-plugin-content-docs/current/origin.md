---
sidebar_position: 2
---

# Origen del proyecto

El proyecto **tracking-gps** surge de la necesidad de tener un servidor backend que maneje el procesamiento y reenvío de datos de tracking entre dos servidores principales: **tracking-capture** y **tracking-monitor**. La idea surgió por que el servidor **tracking-reports-gen** estaba manejando demasiadas responsabilidades, por eso se decidió separar las funciones en varios servidores, siendo:

- **tracking-gps** el encargado de procesar los datos de tracking de los dispositivos GPS que se instalarán en vehículos.
- **tracking-capture** ya funcionaba de forma independiente, pero si te preguntas cual es su propósito, es el encargado de recibir los datos brutos desde los dispositivos GPS y celulares, para luego coordinarlos y distribuirlos entre las diferentes instancias/nodos que existan de **tracking-gps** y **tracking-personal**.
- **tracking-monitor** es el servidor encargado de comunicarse con el frontend para que pueda mostrar la información en tiempo real a los usuarios finales. Seria como el gateway de todos los micro-servicios que componen el sistema de tracking.
- **tracking-personal** antes lo mencioné, es un servidor muy parecido a **tracking-gps**, pero estará enfocado en el procesamiento de los datos de celulares.
- **tracking-db** es el servidor encargado de almacenar los datos necesarios para que todos los demás servidores funcionen correctamente, como la información de los dispositivos, geo-cercas, puntos de interés, reglas, notificaciones, rutas, etc.
- **tracking-reports** este servidor será el encargado de generar reportes, históricos y estadísticas según la demanda del usuario.
- **tracking-notification** este servidor se encargará de gestionar y enviar las notificaciones a los usuarios según las reglas definidas.

Todos estos servidores conforman el actual sistema de kerno-tracking, cada uno con un propósito específico, permitiendo una arquitectura más modular y escalable. Como notarás antes mencioné nodos/instancias, la idea es que los servidores que mas trabajarán, en este caso **tracking-gps** y **tracking-personal**, puedan escalar horizontalmente, sirviendo múltiples instancias para manejar grandes volúmenes de datos y usuarios simultáneamente.

## ¿Que debería hacer este proyecto?

El proyecto actual, debería cumplir con las siguientes funciones principales:

- Recibir datos de tracking desde **tracking-capture**.
- Listar en memoria o cache los datos como geo-cercas, puntos de interés, reglas, notificaciones, vehículos, grupos de vehículos, etc.
- Calcular en tiempo real la interacción de dispositivos con geo-cercas y puntos de interés.
- Asignar en tiempo real el vehículo y grupos a los que pertenece el dispositivo.
- Reconstruir la posible ruta seguida por el dispositivo entre las ultimas coordenadas recibidas.
- Verificar y procesar las reglas asignadas a los vehículos y grupos.
- Registrar los eventos en la base de datos a través de **tracking-db**.
- Generar las alertas correspondientes cuando se cumplan las condiciones definidas en las reglas.
- Disparar notificaciones cuando se cumplan las condiciones definidas en las reglas.
- Reenviar los datos procesados a **tracking-monitor** a través de Kafka.
- Adicionalmente, permitir la consulta de los datos procesados por medio de APIs para el monitoreo y extracción rápida de datos.
- Calcular el progreso, según objetivos asignados a los vehículos (Este ultimo punto podría no implementarse, depende de que servidor se encargue de esta lógica).
