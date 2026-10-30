const planillaService = require("../services/planilla.service");

const obtenerPlanillaDiaria = async (req, res) => {
    const planilla = await planillaService.obtenerPlanillaDiaria(req.query.fecha, req.usuario);
    res.json(planilla);
};

const obtenerPlanillaMensual = async (req, res) => {
    const planilla = await planillaService.obtenerPlanillaMensual(req.query.mes, req.usuario);
    res.json(planilla);
};

const obtenerPlanillaGeneral = async (req, res) => {
    const planilla = await planillaService.obtenerPlanillaGeneral();
    res.json(planilla);
};

module.exports = {
    obtenerPlanillaDiaria,
    obtenerPlanillaMensual,
    obtenerPlanillaGeneral
};