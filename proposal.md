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
|CRUD simple|1. CRUD Alta de Empleados<br>2. CRUD Alta de Productos<br>3. CRUD Alta de Sucursales<br>4. CRUD Control Stock<br> 5.CRUD Planilla de finanzas|
|CRUD dependiente|1. CRUD Organización de Mesas {depende de} CRUD Sucursal<br>2. CRUD Tipo de Producto {depende de} CRUD Producto<br>3. Tipo de Sucursal {depende de} CRUD Sucursal|
|Listado<br>+<br>detalle| 1. Listado de sucursal filtrado por tipo de sucursal, muestra dirección y horarios => detalle CRUD Sucursal<br> 2. Listado de empleados filtrado por tipo de empleado, muestra cantidad de empleados por tipo  => detalle CRUD Empleado<br> 3. Listado de producto filtrado por tipo de producto, cantidad de stock y popularidad, muestra nombre, descripción del producto y stock  => detalle CRUD Producto|
|CUU/Epic|1. Gestionar sucursal<br>2. Gestionar producto<br>3. Gestionar usuario|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
| **CRUD** | 
1. Categoría de Producto <br>
<br> 2. Tipo de Empleado <br>
<br> 3. Proveedores <br>
<br> 4. Reservas <br>
<br> 5. Promociones/Descuentos |
| **CUU/Epic** | 1. **Gestionar Reserva:** Registro, asignación de mesa y cancelación automática por incomparecencia (30 min). <br>
<br> 2. **Registrar Pago y Facturación:** Aplicación de descuentos (Jubilado/Estudiante) previa validación de certificado y cierre de ticket. <br>
<br> 3. **Consultar Planilla de Ventas Diaria:** Reporte de ticket promedio, producto estrella y total recaudado. |


### Alcance Adicional Voluntario

Cancelación de reserva

*Nota*: El Alcance Adicional Voluntario es opcional, pero ayuda a que la funcionalidad del sistema esté completa y será considerado en la nota en función de su complejidad y esfuerzo.

|Req|Detalle|
|:-|:-|
|Listados |1. Listado de advertencia de stock bajo filtrado por sucursal. Muestra el nombre del producto, la cantidad restante y la sucursal. <br>2. Listado de reservas filtrado por sucursal, fecha y cantidad de personas. Muestra fecha y horario, cantidad de comensales y la sucursal de la reserva. |
|CUU/Epic|1. Gestionar gasto <br>2. Cancelación de reserva <br>3. Registrar pago <br>4. Gestionar stock  <br>5. Consultar planilla de ventas diaria <br>6. Consultar planilla de finanzas <br>7. Consultar informe gerencial general <br>8. Registrar cancelación de reserva |
|Otros| |
