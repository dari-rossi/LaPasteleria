import { useEffect, useState } from "react";
import { obtenerPlanillaGeneral } from "../services/planillaService";
import { formatearId, formatearMes } from "../models/Planilla";
import PlanillaCampo from "./PlanillaCampo";

// Planilla general del mes actual, sumando todas las sucursales (solo la ve el dueño)
function PlanillaGeneral() {
    const [planilla, setPlanilla] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                setPlanilla(await obtenerPlanillaGeneral());
                setError("");
            } catch (error) {
                setError(error.message);
            }
        };

        cargar();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!planilla) {
        return <p>Cargando planilla...</p>;
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
                        etiqueta="ID Producto Estrella:"
                        valor={estrella ? formatearId(estrella.idProducto) : "—"}
                        columnas=""
                    />
                    <PlanillaCampo
                        etiqueta="Nombre Producto Estrella:"
                        valor={estrella ? estrella.nombre : "—"}
                        columnas=""
                    />
                    <PlanillaCampo
                        etiqueta="Sucursal Más Concurrida en el Mes:"
                        valor={concurrida ? formatearId(concurrida.sucursalId) : "—"}
                        columnas=""
                    />
                    <PlanillaCampo
                        etiqueta="Sucursal con Mayor Recaudación en el Mes:"
                        valor={recaudacion ? formatearId(recaudacion.sucursalId) : "—"}
                        columnas=""
                    />
                </div>
            </div>
        </div>
    );
}

export default PlanillaGeneral;