---
sidebar_position: 2
---

# Inicialización del servidor

El servidor es una parte fundamental de la aplicación, actualmente esta en **express**, se encarga de manejar las peticiones HTTP para obtener datos y revisar el estado del cache.
La configuración del servidor se encuentra en la carpeta `src/server`.

## Resumen

Dentro de la carpeta `src/server` podrás observar 2 carpetas y 2 archivos, la carpeta de `interfaces` contiene la respuesta del builder y los métodos que tendrá que implementar el builder, la carpeta `schema` contiene definiciones de objetos con zod para la configuración del servidor, por ultimo los archivos `default-server-limits.ts` contiene la configuración en base al esquema correspondiente y `server-builder.ts` es el archivo principal que contiene la lógica para construir servidores según los parámetros que se le pasen.

## Server builder

El archivo `server-builder.ts` es el encargado de construir el servidor, sigue como base el patrón builder(builder pattern) para facilitar la creación de app express, permitiendo configurar diferentes aspectos de forma granular y flexible.

Lo primero que notarás es que estamos hablando de una clase, la cual tiene el nombre de `ServerBuilder` y que implementa la interfaz `IServerBuilder`, la cual define los métodos que necesita el builder para funcionar correctamente.

Notarás que en el constructor existe esta sintaxis:

```typescript
  constructor(@inject(TOKENS.Application) private readonly app: Application) {}
```

Esto es parte de `tsyringe`, es una forma de inyectar dependencias, el token lo use como una forma de reutilizar la misma instancia de express en cada creación del builder, no es del todo necesario y podría ser reemplazado por algo como esto:

```typescript
  constructor(private readonly app: Application) {}

  public static builder(): ServerBuilder {
    return new ServerBuilder(express());
  }
```

Notarás que en la segunda forma ya no estoy utilizando la sintaxis de `tsyringe`, pero es mas sencillo de entender, y por el constructor pasas directamente la instancia de express.

### Uso de builder inspirado en java

Si alguna vez manejaste java notarás cierta familiaridad con este patrón, la forma y nombres que utiliza, es por que me base en el funcionamiento de builder de java, para ser mas exacto en el builder que te provee `Lombok`, una librería muy popular en el ecosistema java.

```java
  @Builder
  public class User {
    private final String name;
    private final String lastName;
  }

  User user = User.builder().name("John").lastName("Doe").build();
```

Este ejemplo es de java, y como `Lombok` abstrae y facilita el uso del patrón builder en java como notarás no existe necesidad de hacer uso de `new` al momento de llamar a la clase, además notarás que tiene bien marcado el uso de los métodos con nombres como `builder()` y `build()`, indicando el inicio y el fin del proceso de construcción del objeto.

Por esa razón verás algo como:

```typescript
  public static builder(): ServerBuilder {
    return container.resolve(ServerBuilder);
  }
```

Esto logra lo mismo, define un método estático llamado `builder()` que inicia el proceso de construcción del objeto `ServerBuilder`, y al finalizar verás el uso del método `build()`.

```typescript
  public build(): ServerBuilderResponse {
    this.validate();

    return { getApp: () => this.app, start: () => this.start() };
  }
```

Que retorna el objeto construido, en este caso verás que retorna el objeto app con toda la configuración y el método `start()` para iniciar rápidamente el servidor.

### Parámetros que recibe el builder (withRequest)

El builder espera varios métodos en cadena antes de llamar a `build()`, uno de ellos es `withRequest()`, recibe un objeto con la siguiente forma:

```typescript
export interface ServerBuilderRequest {
	app?: Application; // no es necesario pasarlo, de uso interno
	host?: string; // host para express
	port?: number; // puerto para express
	staticPath?: string; // path para archivos estáticos
}
```

El host, port y staticPath son configurables pero opcionales, a excepción del port, que si es necesario para iniciar el servidor.

:::note
Si no configuras el port, en el caso del servidor principal, en `config/env.ts` ya se estableció un puerto por defecto, que debería corresponder al puerto 7767. Pero para configurar otros servidores que usen el builder, es util que recuerdes que el puerto es necesario para que funcione correctamente.
:::

### Cors

Por defecto cors esta definido de esta forma para todos los servidores creados con el builder:

```typescript
  private readonly setCors = (): void => {
   this.app?.use(
    cors({
      origin: '*',
      optionsSuccessStatus: 200,
      }),
    );
  };
```

:::note
Puedes cambiarlo... pero ten en cuenta que afectará a todos los servidores que usen el builder, para corregir esto se debería actualizar o modificar la forma en la que se configuran middlewares en el builder, en su momento esta es la mejor forma que vi para hacerlo, pero actualmente se puede mejorar.
:::

### Routes

Las rutas se configuran en el builder mediante el método `applyRoutes()`, recibe un objeto con la siguiente forma:

```typescript
  public applyRoutes(router: Router): this {
    swaggerConfig(this.app);

    this.app.get('/', (req, res) => {
      res.redirect('docs');
    });

    this.app?.use('/api', router);
    return this;
  }
```

:::note
Notarás que dentro agregue manualmente una configuración para la documentación de la API, con solo ver eso notarás que este método se puede mejorar, inclusive se puede agregar sobrecarga para que se acepten varias configuraciones una sobre otra, y que al final se apliquen todas, pero por la premura lo deje de esta forma y tuve que agregar manualmente la configuración de swagger.
:::

### Start

Antes te hablé del método `start()`, este es el encargado de iniciar el servidor,
pero si te preguntas por que decidí separarlos y dejar a elección de quien use el builder el inicio del servidor, tiene varias razones, la principal es que socket.io no corre directamente sobre express, al contrario necesita el app para montar el servicio sobre el servidor configurado, asi logra que corran los 2 servicios en el mismo puerto. Luego otras razones serian que por diseño no se debería imponer cuando se inicia el servidor, asi .. si se tienen configuraciones adicionales, middlewares o cualquier otra razón que te imagines, tengan la libertad de iniciar el servidor en el momento que lo deseen.

```typescript
  public start(): Server {
    const { host, port } = this.request ?? {};

    if (!host) {
      return this.app?.listen(port, () => this.getMessageSuccess());
    }

    return this.app?.listen(port!, host, () => this.getMessageSuccess());
  }
```

Este método es sencillo, pone a escuchar el servidor en el puerto y host configurados, si no se configura host, se asume que es localhost.
