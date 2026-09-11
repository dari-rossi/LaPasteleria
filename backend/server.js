const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    res.json({
        mensaje: "API de La Pastelería funcionando"
    });
});

app.listen(PORT, () => {
    console.log('Servidor funcionando en http://localhost:${PORT}');
});