const cors = require('cors');
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const sucursalRoutes = require("./src/routes/sucursal.routes");
const productoRoutes = require("./src/routes/producto.routes");
const inventarioRoutes = require('./src/routes/inventario.routes');
const reservaRoutes = require("./src/routes/reserva.routes");
const mesaRoutes = require("./src/routes/mesa.routes");
const clienteRoutes = require('./src/routes/cliente.routes');
const pagoRoutes = require('./src/routes/pago.routes');
const tipoEmpleadoRoutes = require("./src/routes/tipoEmpleado.routes");
const sucursalTipoEmpleadoRoutes = require("./src/routes/sucursalTipoEmpleado.routes");
const gastoRoutes = require("./src/routes/gasto.routes");
const itemProductoRoutes = require("./src/routes/itemProducto.routes");
const pedidoRoutes = require("./src/routes/pedido.routes");
const authRoutes = require("./src/routes/auth.routes");
const usuarioRoutes = require("./src/routes/usuario.routes");
const reservaService = require("./src/services/reserva.service"); // Corregir
const { rutaNoEncontrada, manejarErrores } = require("./src/config/errores");
const planillaRoutes = require("./src/routes/planilla.routes");


const app = express();
const PORT = 3000;

const revisarReservas = async () => {
    try {
        await reservaService.cancelarReservasVencidas();
    } catch (error) {
        console.error("Error al cancelar las reservas vencidas:", error);
    }
};

revisarReservas();
setInterval(revisarReservas, 60 * 1000);

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de La Pastelería funcionando"
    });
});

app.use("/auth", authRoutes);
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
app.use("/itemProducto", itemProductoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/planillas", planillaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use(rutaNoEncontrada);
app.use(manejarErrores);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});