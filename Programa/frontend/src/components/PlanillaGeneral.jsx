import { useEffect, useState } from "react";
import { obtenerPlanillaGeneral } from "../services/planillaService";
import {
    formatearId,
    formatearMes,
    formatearMonto
} from "../models/Planilla";
import PlanillaCampo from "./PlanillaCampo";

function PlanillaGeneral() {
    const [planilla, setPlanilla] = useState(null);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let vigente = true;

        const cargar = async () => {
            setCargando(true);
            setError("");

            try {
                const datos = await obtenerPlanillaGeneral();

                if (vigente) {
                    setPlanilla(datos);
                }
            } catch (error) {
                if (vigente) {
                    setError(error.message);
                }
            } finally {
                if (vigente) {
                    setCargando(false);
                }
            }
        };

        cargar();

        return () => {
            vigente = false;
        };
    }, []);

    if (cargando) {
        return <p>Cargando planilla general...</p>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!planilla) {
        return <p>No se pudo obtener la planilla general.</p>;
    }

    const estrella = planilla.productoEstrella;
    const concurrida = planilla.sucursalMasConcurrida;
    const recaudacion = planilla.sucursalMayorRecaudacion;

    return (
        <div className="card" style={{ maxWidth: "36rem" }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">Planilla General</h5>
                    <strong>{formatearMes(planilla.mes)}</strong>
                </div>

                <div className="row g-3">
                    <PlanillaCampo
                        etiqueta="ID Producto Estrella"
                        valor={estrella ? formatearId(estrella.idProducto) : "—"}
                        columnas=""
                    />

                    <PlanillaCampo
                        etiqueta="Nombre Producto Estrella"
                        valor={estrella ? estrella.nombre : "—"}
                        columnas=""
                    />

                    <PlanillaCampo
                        etiqueta="Sucursal Más Concurrida en el Mes"
                        valor={concurrida
                            ? formatearId(concurrida.sucursalId)
                            : "—"}
                        columnas=""
                    />

                    <PlanillaCampo
                        etiqueta="Cantidad de comensales"
                        valor={concurrida ? concurrida.comensales : "—"}
                        columnas=""
                    />

                    <PlanillaCampo
                        etiqueta="Sucursal con Mayor Recaudación en el Mes"
                        valor={recaudacion
                            ? formatearId(recaudacion.sucursalId)
                            : "—"}
                        columnas=""
                    />

                    <PlanillaCampo
                        etiqueta="Monto recaudado (en $)"
                        valor={recaudacion
                            ? formatearMonto(recaudacion.recaudacion)
                            : "—"}
                        columnas=""
                    />
                </div>
            </div>
        </div>
    );
}

export default PlanillaGeneral;