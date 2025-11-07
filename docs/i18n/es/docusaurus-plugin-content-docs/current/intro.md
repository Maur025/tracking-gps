---
sidebar_position: 1
---

# Introducción

El proyecto Tracking Gps es un servidor backend que corre en Node.js + typescript, su objetivo principal es recibir datos del servidor **tracking-capture**, procesar los datos y reenviarlos a el servidor **tracking-monitor**, el servidor solo se encarga de procesar los datos, no guarda ningún dato de forma persistente, aunque actualmente si esta manejando redis para guardar temporalmente datos en cache.

## Stack Tecnológico

El proyecto esta construido con las siguientes tecnologías:

- [Node.js](https://nodejs.org/) en su version 20.x, tiene compatibilidad con versiones superiores.
- [TypeScript](https://www.typescriptlang.org/) en su version 5.8.x.
- [express](https://expressjs.com/) en su version 5.x usado para Rest API.
- [kafkaJs](https://kafka.js.org/) en su version 2.x usado para recibir y enviar los datos de tracking.
- [redis](https://redis.io/) en su version 5.x usado para conectarse a redis y guardar datos en cache temporalmente.
- [turf.js](https://turfjs.org/) en su version 7.x usado para el calculo geo-espacial de coordenadas, distancias, areas, etc.
- [vitest](https://vitest.dev/) en su version 3.x para las pruebas unitarias y de integración.

## Aclaraciones sobre dependencias que podrías encontrar en el proyecto

- Si encuentras dependencias con este prefijo `@maur025/` son librerías pequeñas que desarrollé para evitar la duplicación de código, no son muy complejas pero cumplen con su función, se pueden remover y reemplazar con código propio si es necesario, pero ten en cuenta que el que esta enfocado al manejo de logs (`@maur025/core-logger`) es complejo de remover, la función de esta librería es estandarizar el manejo de logs, y adicionalmente registrarlos en un archivo de logs que notaras que se crea en la raíz del proyecto, puede ser reemplazado pero tienes que reemplazarlo en muchos archivos, adicionalmente deberás implementar tu propio sistema de logging.

- [clickhouse](https://clickhouse.com/) es una base de datos columnar, es diferente de las bases de datos tradicionales y promete que la lectura de datos será mas rápida y eficiente, lo coloque en este apartado por que no es una tecnología que se llegue a quedar en el proyecto, actualmente esta para pruebas, estoy evaluando si puede ser útil un logger a nivel de base de datos que almacene las interacciones de las geo-cercas y eventos importantes, pero no es algo definitivo, debo reunirme y preguntar al equipo si es algo util para el proyecto o no. Según la respuesta podría ser removido o quedarse en el proyecto.

- [zod](https://zod.dev/) mi aliado de confianza, es la herramienta que probablemente mas estoy usando en el proyecto, es una librería de validación y parsing de datos, la estoy usando para realizar validaciones rápidas, para la construcción de typos a partir de esquemas y por ultimo para controlar que es lo que reciben la mayoría de las funciones y métodos

  Si llegas a ver algo como esto:

  ```typescript
  export const DeviceGroup = BaseData.extend({
  	name: string().nonempty(),
  	description: string(),
  });

  export type DeviceGroup = z.infer<typeof DeviceGroup>;

  // forma de hacer un parsing y validación
  const { name, description } = DeviceGroup.parse({ name: 'example' });
  // esto lanzará un error por que el objeto no cumple con el esquema
  ```

- [tsyringe](https://www.npmjs.com/package/tsyringe) es una librería que facilita la inyección de dependencias en TypeScript, mi idea inicial para el proyecto era usar POO para todo, pero luego vi que no era del todo necesario, la librería es util por que existen archivos donde la estoy utilizando.

- [rxjs](https://rxjs.dev/) veras a rxjs en las dependencias, te preguntarás el por que, ya que node tiene fetch en sus versiones mas recientes, la razón fue que al comienzo del proyecto, cuando realizaba la migración de funciones y características desde **tracking-reports-gen** el cual es el servidor que dio origen a muchos mas tras su división, ahi vi que se estaba usando una implementación propia de algo muy parecido a rxjs para el manejo de peticiones, asi que en ese momento decidí usar rxjs ya que es una librería completa y con muchas mas características, aunque ahora puedo decir que no fue un acierto, ya que implica complicarse demasiado para algo que puede hacerse fácilmente con fetch y async/await y promise all en el caso de concurrencia, actualmente la deje por compatibilidad y mas que todo por la falta de tiempo, ya que en su momento existían muchas tareas con mayor prioridad asi que lo deje de lado, debe removerse, ya que no veo necesario su uso en el proyecto.

- [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) por ultimo me queda mencionar a esta librería, la cual me fue util para generar la documentación del API para swagger, explicare como esta implementado en el proyecto en la sección de documentación del API, pero fue muy útil para ahorrar tiempo y probar mas rápido.

Para finalizar, todo lo que use en el proyecto fue lo que consideré necesario por mi parte, ya que no se tenían definidos los parámetros a seguir y como hacerlos, prácticamente me di modos de continuar con el desarrollo para no retrasarme con mis tareas, por lo que se vera las buenas y malas decisiones que llegue a tomar en un momento dado según lo que me pedían.

Siento alargarme mucho con la introducción pero el stack utilizado y el propósito del proyecto me pareció la mejor forma de iniciar la documentación.
