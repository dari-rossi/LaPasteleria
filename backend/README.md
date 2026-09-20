# Backend - La Pastelería

Esta carpeta tiene el backend del proyecto. Está hecho con **Node.js + Express**, usa **Prisma** para comunicarse con la base de datos MySQL y **Zod** para validar los datos.

## Contenido

```text
backend/
├── prisma/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   └── prisma.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

### `prisma/`

Acá está el archivo `schema.prisma`, donde se define cómo son las tablas/modelos que usamos en la base de datos.
También pueden aparecer las migraciones de Prisma.

### `src/config/`

Tiene configuraciones del proyecto.
Por ahora está `swagger.js`, que configura Swagger para poder ver y probar los endpoints de la API.

### `src/controllers/`

Acá están las funciones que reciben las peticiones y devuelven las respuestas.
Por ejemplo, `sucursal.controller.js` tiene las funciones para obtener, crear, modificar y eliminar sucursales.

### `src/middlewares/`

Son funciones que se ejecutan antes de llegar al controller.
Por ejemplo, `validate.js` recibe un esquema de Zod y verifica que los datos enviados son válidos.

### `src/repositories/`

Es la parte que se encarga de acceder a la base de datos usando Prisma.
Por ejemplo: `sucursal.repository.js` tiene las operaciones para buscar, crear, modificar y eliminar sucursales.

### `src/routes/`

Acá se definen las rutas de la API.
Por ejemplo:

```text
GET    /sucursales
GET    /sucursales/:id
POST   /sucursales
PUT    /sucursales/:id
DELETE /sucursales/:id
```

### `src/schemas/`

Acá están las validaciones hechas con Zod.
Por ejemplo, `sucursal.schema.js` verifica que los datos necesarios de una sucursal no estén vacíos.

### `src/services/`

Acá está la lógica que queda entre el controller y el repository.
El controller llama al service y el service llama al repository.

### `src/prisma.js`

Acá se crea la instancia de Prisma
Después los repositories pueden usar esa misma instancia para acceder a la base de datos.

### `server.js`

Es donde se configura y se levanta el servidor Express.
También se registran las rutas y Swagger.

## Para levantar el servidor

Instalar las dependencias:

```bash
npm install
```

Después hay que tener configurado el archivo `.env` con la conexión a MySQL.
Después ejecutar:

```bash
node server.js
```

El servidor queda disponible en:

```text
http://localhost:3000
```

Y Swagger en:

```text
http://localhost:3000/api-docs
```
