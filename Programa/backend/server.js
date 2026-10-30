require("dotenv").config();

const app = require("./app");
const reservaService = require("./src/services/reserva.service");

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

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});