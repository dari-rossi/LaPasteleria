const planillaService = require("../services/planilla.service");

const obtenerPlanillaDiaria = async (req, res, next) => {
    try {
        const planilla = await planillaService.obtenerPlanillaDiaria(
            req.query.fecha,
            req.usuario,
            req.query.sucursalId
        );

        res.json(planilla);
    } catch (error) {
        next(error);
    }
};

const obtenerPlanillaMensual = async (req, res, next) => {
    try {
        const planilla = await planillaService.obtenerPlanillaMensual(
            req.query.mes,
            req.usuario,
            req.query.sucursalId
        );

        res.json(planilla);
    } catch (error) {
        next(error);
    }
};

const obtenerPlanillaGeneral = async (req, res, next) => {
    try {
        const planilla = await planillaService.obtenerPlanillaGeneral();

        res.json(planilla);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerPlanillaDiaria,
    obtenerPlanillaMensual,
    obtenerPlanillaGeneral
};