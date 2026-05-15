# Propuesta TP DSW

## Grupo
### Integrantes
* 54175 - Bucher, Guadalupe Aylen
* 54547 - Crispo, Ignacio Martín
* 52256 - Miranda, Santiago José 
* 53953 - Rossi Avonto, Dariana
* 55061 - Sacchetti, Camila Maylén

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema - La Pastelería
### Descripción
* La Pastelería es una cafetería ubicada en la ciudad de Rosario que ofrece servicios de cafetería durante el día y bar por la noche en una de sus sucursales. Su funcionamiento se basa en la atención al cliente mediante reservas, asignación de mesas y toma de pedidos online, con control de stock en tiempo real. El negocio busca mejorar la gestión de productos, ventas y finanzas a través de un sistema integrado.

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Empleados<br>2. CRUD Productos<br>3. CRUD Sucursales<br>4. CRUD Reserva<br> 5.CRUD Pedido|
|CRUD dependiente|1. CRUD Mesa {depende de} CRUD Sucursal<br>2. CRUD Cliente {depende de} CRUD Tipo Descuento<br>3. CRUD Gasto {depende de} CRUD Sucursal|
|Listado<br>+<br>detalle| 1. Listado de sucursal filtrado por tipo de sucursal, muestra dirección y horarios => detalle CRUD Sucursal<br> 2. Listado de empleados filtrado por tipo de empleado, muestra cantidad de empleados por tipo  => detalle CRUD Empleado<br> 3. Listado de producto filtrado por tipo de producto, cantidad de stock y popularidad, muestra nombre, descripción del producto y stock  => detalle CRUD Producto|
|CUU/Epic|1. Dar de alta mesa para cliente<br>2. Cargar pedido<br>3. Registrar reserva para cliente|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
| **CRUD** | 1. CRUD Pago<br>2. CRUD Item Producto |
| **CUU/Epic** | 1. Cargar pedido de stock<br>2. Registrar Pago<br>3. Consultar Planilla de Ventas Diarias |


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de advertencia de stock bajo filtrado por sucursal. Muestra el nombre del producto, la cantidad restante y la sucursal. <br>2. Listado de reservas filtrado por sucursal, fecha y cantidad de personas. Muestra fecha y horario, cantidad de comensales y la sucursal de la reserva. |
|CUU/Epic|1. Gestionar gasto <br>2. Cancelación de reserva <br>3. Registrar pago <br>4. Gestionar stock  <br>5. Consultar planilla de ventas diaria <br>6. Consultar planilla de finanzas <br>7. Consultar informe gerencial general <br>8. Registrar cancelación de reserva |
|Otros| |
