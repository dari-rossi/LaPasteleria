# La Pastelería

Aplicación web full stack para la gestión de **La Pastelería**, una cafetería de la ciudad de Rosario que funciona como cafetería de día y bar de noche en una de sus sucursales. El sistema permite administrar sucursales, empleados, productos con control de stock, mesas, reservas, pedidos, pagos (incluido pago con QR de Mercado Pago), gastos, clientes con descuento e informes de ventas.

Trabajo Práctico de la materia **Desarrollo de Software (DSW)**.

## Links importantes

| Qué | Link |
|:-|:-|
| 🎥 Video explicando el funcionamiento del sistema | [Ver video](PEGAR_LINK_AL_VIDEO) |
| 📁 Repositorio | https://github.com/dari-rossi/LaPasteleria |
| 📝 Propuesta del TP | [proposal.md](proposal.md) |

## Integrantes

| Legajo | Integrante |
|:-|:-|
| 54175 | Bucher, Guadalupe Aylen |
| 54547 | Crispo, Ignacio Martín |
| 53953 | Rossi Avonto, Dariana |
| 55061 | Sacchetti, Camila Maylén |

## Tecnologías usadas

### Backend (`Programa/backend`)

| Tecnología | Uso |
|:-|:-|
| **Node.js** + **JavaScript** | Entorno de ejecución y lenguaje |
| **Express 5** | Framework web y API REST |
| **MySQL** | Base de datos relacional (servicio externo, con persistencia en disco) |
| **Prisma 6** | ORM / mapper y migraciones |
| **Zod 4** | Validación de los datos de entrada |
| **JSON Web Token** (`jsonwebtoken`) | Autenticación mediante token |
| **bcryptjs** | Hash de contraseñas |
| **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) | Documentación interactiva de la API |
| **dotenv** | Variables de entorno (`.env`) |
| **cors** | Comunicación con el frontend |
| **Jest** + **Supertest** | Tests automatizados del backend |
| **Mercado Pago API** | Pago con código QR |

### Frontend (`Programa/frontend`)

| Tecnología | Uso |
|:-|:-|
| **React 19** | Biblioteca/framework de frontend |
| **Vite 8** | Servidor de desarrollo y build |
| **React Router 7** | Navegación y protección de rutas por rol |
| **Bootstrap 5** | Estilos y diseño responsive |
| **qrcode.react** | Generación del QR de pago |
| **Vitest** + **Testing Library** | Tests unitarios de componentes |
| **Cypress** | Tests end-to-end |
| **ESLint** | Análisis estático del código |

## Arquitectura

La aplicación está dividida en dos partes independientes que se comunican mediante una API REST:

```text
 Frontend (React + Vite)   ──── HTTP / JSON ────▶   Backend (Express)   ───▶   MySQL
 http://localhost:5173           (token JWT)         http://localhost:3000       (vía Prisma)
```

El backend está organizado en capas:

```text
routes → middlewares (autenticación, roles, validación con Zod) → controllers → services → repositories → Prisma → MySQL
```

Además, el manejo de errores está centralizado: la API responde siempre con un código HTTP y un mensaje claro (`{ codigo, error, detalles }`).

## Funcionalidades principales

- **Login** con usuario y contraseña, y **4 niveles de acceso** (roles): Dueño, Gerente, Mozo y Ayudante de cocina. Las rutas del backend y las pantallas del frontend están protegidas según el rol.
- **Sucursales**, **tipos de empleado** y asignación de empleados por sucursal, y **usuarios** del sistema.
- **Productos** e **inventario** por sucursal, con listado de advertencia de **stock bajo**.
- **Mesas** en una grilla visual con su estado (libre, ocupada, reservada). Solo el dueño y el gerente pueden crearlas, modificarlas o eliminarlas.
- **Reservas** de mesas. Las reservas vencidas se cancelan automáticamente (el servidor lo revisa cada minuto).
- **Pedidos** con sus productos (items), estados (Pendiente, En preparación, Entregado, Pagado, Cancelado) y detalle.
- **Pagos** en efectivo, tarjeta, transferencia o **Mercado Pago (QR)**, con el descuento correspondiente al tipo de cliente.
- **Clientes (categorías con descuento)**: el dueño puede crear distintas categorías con su porcentaje (por ejemplo, *Docente 10%*).
- **Gastos** por sucursal.
- **Informes / planillas** de ventas: diaria, mensual y general.

### Qué puede hacer cada rol

| Rol | Alcance |
|:-|:-|
| **Dueño** | Acceso a todas las sucursales. Administra sucursales, usuarios, tipos de empleado, productos, clientes y ve los informes. |
| **Gerente** | Trabaja en su sucursal: mesas, inventario, gastos, productos y consulta de pedidos y clientes. |
| **Mozo** | Toma pedidos y reservas. Ve las mesas y productos, pero no puede crearlos, modificarlos ni eliminarlos. |
| **Ayudante de cocina** | Consulta productos y actualiza el stock del inventario. |

## Requisitos previos

Antes de empezar tenés que tener instalado:

- [Node.js](https://nodejs.org) **22 LTS** (mínimo 20.19) — incluye `npm`.
- [MySQL](https://dev.mysql.com/downloads/) **8** corriendo en tu computadora.
- [Git](https://git-scm.com).

## Instalación y ejecución (paso a paso)

El proyecto tiene dos carpetas que se levantan por separado: `Programa/backend` y `Programa/frontend`. Necesitás **dos terminales**.

### 1. Clonar el repositorio

```bash
git clone https://github.com/dari-rossi/LaPasteleria.git
cd LaPasteleria/Programa
```

### 2. Crear la base de datos

Entrá a MySQL y creá una base vacía:

```sql
CREATE DATABASE la_pasteleria;
```

### 3. Levantar el backend

```bash
cd backend
npm install
```

Creá el archivo de variables de entorno a partir del ejemplo:

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env
```

Abrí el archivo `.env` y completá los valores:

| Variable | Qué poner | ¿Obligatoria? |
|:-|:-|:-:|
| `DATABASE_URL` | Conexión a MySQL. Ejemplo: `mysql://root:TU_CONTRASENA@localhost:3306/la_pasteleria` | Sí |
| `JWT_SECRET` | Una clave larga y secreta cualquiera para firmar los tokens | Sí |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token de Mercado Pago | Solo para pago con QR |
| `MERCADOPAGO_POS_EXTERNAL_ID` | Identificador de la caja (por defecto `CAJADSW001`) | Solo para pago con QR |
| `MERCADOPAGO_USER_ID` | Id de usuario de Mercado Pago | Solo para el script de configuración |

Creá las tablas y cargá los datos iniciales (sucursales, productos, mesas, tipos de cliente, roles y usuarios de prueba):

```bash
npm run db:migrate
npm run db:seed
```

Levantá el servidor:

```bash
npm run dev
```

Si todo salió bien vas a ver `Servidor funcionando en http://localhost:3000`.
La documentación Swagger queda en http://localhost:3000/api-docs.

> Para ejecutar sin recarga automática usá `npm start`.

### 4. Levantar el frontend

En **otra terminal**:

```bash
cd LaPasteleria/Programa/frontend
npm install
npm run dev
```

Abrí en el navegador la dirección que muestra la terminal, normalmente http://localhost:5173.

> El frontend se conecta al backend en `http://localhost:3000`, así que el backend tiene que estar corriendo en ese puerto.

### 5. Iniciar sesión

Con el seed se crean estos usuarios de prueba:

| Rol | Usuario | Contraseña | Sucursal |
|:-|:-|:-|:-:|
| Dueño | `duenio` | `duenioDSW` | todas |
| Gerente | `gerente1` | `gerenteDSW1` | 1 |
| Mozo | `mozo1` | `mozoDSW1` | 1 |
| Ayudante de cocina | `cocina1` | `cocinaDSW1` | 1 |
| Gerente | `gerente2` | `gerenteDSW2` | 2 |
| Mozo | `mozo2` | `mozoDSW2` | 2 |
| Ayudante de cocina | `cocina2` | `cocinaDSW2` | 2 |

Los tipos de cliente iniciales son **General (0%)**, **Estudiante (15%)** y **Jubilado (20%)**. El dueño puede agregar más desde la sección *Clientes*.

### Pago con Mercado Pago (opcional)

El pago con QR necesita una cuenta de pruebas de Mercado Pago. Completá `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_USER_ID` y `MERCADOPAGO_POS_EXTERNAL_ID` en el `.env` y, una sola vez, ejecutá desde `Programa/backend`:

```bash
node scripts/configurarMercadoPago.js
```

Los demás métodos de pago funcionan sin esta configuración.

## Scripts disponibles

### Backend (`Programa/backend`)

| Comando | Qué hace |
|:-|:-|
| `npm run dev` | Levanta el servidor con recarga automática |
| `npm start` | Levanta el servidor |
| `npm run db:migrate` | Aplica las migraciones a la base de datos |
| `npm run db:seed` | Carga los datos iniciales y los usuarios de prueba |
| `npm run db:reset` | Reinicia la base de datos (borra todo y vuelve a cargar) |
| `npm test` | Ejecuta los tests con Jest |

### Frontend (`Programa/frontend`)

| Comando | Qué hace |
|:-|:-|
| `npm run dev` | Levanta el servidor de desarrollo (Vite) |
| `npm run build` | Genera la versión para producción en `dist/` |
| `npm run preview` | Sirve localmente la versión de producción |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Ejecuta los tests unitarios con Vitest (modo watch) |
| `npm run cy:open` | Abre Cypress de forma interactiva |
| `npm run cy:run` | Ejecuta los tests end-to-end en consola |

## Tests automáticos

### Tests del backend (Jest)

```bash
cd Programa/backend
npm test
```

### Tests unitarios del frontend (Vitest)

```bash
cd Programa/frontend
npx vitest run
```

### Tests end-to-end (Cypress)

Con el **backend y el frontend corriendo**, creá el archivo `Programa/frontend/cypress.env.json` con un usuario válido (por ejemplo el dueño):

```json
{
    "usuario": "duenio",
    "contrasenia": "duenioDSW"
}
```

Y ejecutá:

```bash
cd Programa/frontend
npm run cy:run
```

## Documentación de la API

La API está documentada con **Swagger (OpenAPI)** y se puede probar desde el navegador en `/api-docs`. Para probar los endpoints protegidos, primero hacé `POST /auth/login` y usá el token devuelto en el botón **Authorize**.

Recursos principales de la API:

| Recurso | Ruta base |
|:-|:-|
| Autenticación | `/auth` |
| Sucursales | `/sucursales` |
| Tipos de empleado | `/tipos-empleado` |
| Empleados por sucursal | `/sucursales/:sucursalId/tipos-empleado` |
| Usuarios | `/usuarios` |
| Productos | `/productos` |
| Inventario | `/inventario` |
| Mesas | `/mesas` |
| Reservas | `/reservas` |
| Clientes | `/clientes` |
| Pedidos | `/pedidos` |
| Items de pedido | `/itemProducto` |
| Pagos | `/pagos` |
| Gastos | `/gastos` |
| Planillas (informes) | `/planillas` |

## Estructura del proyecto

```text
LaPasteleria/
├── README.md
├── proposal.md
├── docs/                     # Documentación del proyecto
└── Programa/
    ├── backend/
    │   ├── prisma/           # schema.prisma, migraciones y seeds
    │   ├── scripts/          # configuración de Mercado Pago
    │   ├── src/
    │   │   ├── config/       # errores, swagger, horarios, estados
    │   │   ├── controllers/
    │   │   ├── middlewares/  # autenticación, roles y validación
    │   │   ├── repositories/ # acceso a la base de datos (Prisma)
    │   │   ├── routes/
    │   │   ├── schemas/      # validaciones con Zod
    │   │   ├── services/     # lógica de negocio
    │   │   └── tests/
    │   ├── app.js
    │   └── server.js
    └── frontend/
        ├── cypress/          # tests end-to-end
        └── src/
            ├── components/
            ├── context/      # sesión y sucursal seleccionada
            ├── models/       # clases de los modelos
            ├── pages/
            ├── services/     # llamadas a la API
            └── tests/
```