import { useEffect, useState } from "react";
import { obtenerPlanillaMensual } from "../services/planillaService";
import {
    mesActualArgentina,
    formatearMonto,
    formatearId
} from "../models/Planilla";
import PlanillaCampo from "./PlanillaCampo";
import { useSucursal } from "../context/SucursalContext";

function PlanillaMensual() {
    const { sucursalId } = useSucursal();
    const [mes, setMes] = useState(mesActualArgentina());
    const [planilla, setPlanilla] = useState(null);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!mes || !sucursalId) {
            setPlanilla(null);
            setError("");
            setCargando(false);
            return;
        }

        let vigente = true;

        const cargar = async () => {
            setCargando(true);
            setError("");
            setPlanilla(null);

            try {
                const datos = await obtenerPlanillaMensual(mes);

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
    }, [mes, sucursalId]);

    const estrella = planilla?.productoEstrella;

    return (
        <div>
            <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                <label htmlFor="planilla-mes" className="form-label mb-0">
                    Mes:
                </label>

                <input
                    id="planilla-mes"
                    type="month"
                    className="form-control w-auto"
                    max={mesActualArgentina()}
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                />
            </div>

            {!sucursalId && (
                <div className="alert alert-info">
                    Seleccioná una sucursal para consultar la planilla.
                </div>
            )}

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {cargando && <p>Cargando planilla mensual...</p>}

            {planilla && !cargando && (
                <div className="row g-3">
                    <PlanillaCampo
                        etiqueta="Ventas"
                        valor={planilla.ventas}
                    />

                    <PlanillaCampo
                        etiqueta="Monto promedio por venta (en $)"
                        valor={formatearMonto(planilla.montoPromedioPorVenta)}
                    />

                    <PlanillaCampo
                        etiqueta="Total de clientes"
                        valor={planilla.totalClientes}
                    />

                    <PlanillaCampo
                        etiqueta="Monto promedio por persona (en $)"
                        valor={formatearMonto(planilla.montoPromedioPorPersona)}
                    />

                    <PlanillaCampo
                        etiqueta="ID Producto Estrella"
                        valor={estrella ? formatearId(estrella.idProducto) : "—"}
                    />

                    <PlanillaCampo
                        etiqueta="Nombre Producto Estrella"
                        valor={estrella ? estrella.nombre : "—"}
                    />
                </div>
            )}
        </div>
    );
}

export default PlanillaMensual;