# Propuesta TP DSW

## Grupo
### Integrantes
* 54175 - Bucher, Guadalupe Aylen
* 54547 - Crispo, Ignacio Martín
* 53953 - Rossi Avonto, Dariana
* 55061 - Sacchetti, Camila Maylén

### Repositorios
* [fullstack app](https://github.com/dari-rossi/LaPasteleria/tree/main/Programa)

## Tema - La Pastelería
### Descripción
* La Pastelería es una cafetería ubicada en la ciudad de Rosario que ofrece servicios de cafetería durante el día y bar por la noche en una de sus sucursales. Su funcionamiento se basa en la atención al cliente mediante reservas, asignación de mesas y toma de pedidos online, con control de stock en tiempo real. El negocio busca mejorar la gestión de productos, ventas y finanzas a través de un sistema integrado.

### Modelo
![imagen del modelo](https://github.com/dari-rossi/LaPasteleria/blob/6f93e68c5748d1f53e0fc25bdcf4af8bb3e75363/DC%20-%20LaPasteleria.png)

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Sucursal<br>2. CRUD Producto<br>3. CRUD Tipo Empleado<br>4. CRUD Mesa|
|CRUD dependiente|1. CRUD Reserva {depende de} CRUD Mesa<br>2. CRUD Gasto {depende de} CRUD Sucursal|
|Listado<br>+<br>detalle|1. Listado de advertencia de stock bajo filtrado por sucursal. Muestra el nombre del producto, la cantidad restante y la sucursal.<br>2. Listado de productos filtrado por tipo de producto, cantidad de stock y popularidad. Muestra nombre, descripción del producto y stock mínimo.|
|CUU/Epic|1. Registrar reserva para cliente<br>2. Cargar pedido|


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
| **CRUD** | 1. CRUD Pago<br>2. CRUD Item Producto<br>3. CRUD Pedido<br>4. CRUD Inventario<br>5. CRUD Sucursal Tipo Empleado |
| **CUU/Epic** | 1. Cargar pedido de stock<br>2. Registrar Pago |


### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listados|1. Listado de reservas filtrado por sucursal, fecha y cantidad de personas. Muestra fecha y horario, cantidad de comensales y la sucursal de la reserva.|