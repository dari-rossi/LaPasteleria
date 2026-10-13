const cors = require('cors');
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const sucursalRoutes = require("./src/routes/sucursal.routes");
const productoRoutes = require("./src/routes/producto.routes");
const inventarioRoutes = require('./src/routes/inventario.routes');
<<<<<<< HEAD
const reservaRoutes = require("./src/routes/reserva.routes");
const mesaRoutes = require("./src/routes/mesa.routes");
const clienteRoutes = require('./src/routes/cliente.routes');
const pagoRoutes = require('./src/routes/pago.routes');
=======

const tipoEmpleadoRoutes = require("./src/routes/tipoEmpleado.routes");
const sucursalTipoEmpleadoRoutes = require("./src/routes/sucursalTipoEmpleado.routes");
const gastoRoutes = require("./src/routes/gasto.routes");

>>>>>>> origin/tipoEmpleado
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de La Pastelería funcionando"
    });
});

app.use("/sucursales", sucursalRoutes);
app.use("/productos", productoRoutes);
app.use('/inventario', inventarioRoutes);
app.use('/reservas', reservaRoutes);
app.use("/mesas", mesaRoutes);
app.use("/clientes", clienteRoutes);
app.use("/pagos", pagoRoutes);

app.use("/tipos-empleado", tipoEmpleadoRoutes);
app.use("/sucursales", sucursalTipoEmpleadoRoutes);
app.use("/gastos", gastoRoutes);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});