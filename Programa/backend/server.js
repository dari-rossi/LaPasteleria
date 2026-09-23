const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const sucursalRoutes = require("./src/routes/sucursal.routes");
const productoRoutes = require("./src/routes/producto.routes");
const inventarioRoutes = require('./src/routes/inventario.routes');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de La Pastelería funcionando"
    });
});

app.use("/sucursales", sucursalRoutes);
app.use("/productos", productoRoutes);
app.use('/inventario', inventarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});