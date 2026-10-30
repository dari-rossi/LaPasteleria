import { useEffect, useState } from "react";
import { obtenerPlanillaDiaria } from "../services/planillaService";
import { hoyArgentina, formatearMonto, formatearId } from "../models/Planilla";
import PlanillaCampo from "./PlanillaCampo";
import { useSucursal } from "../context/SucursalContext";

function PlanillaDiaria() {
    const { sucursalId } = useSucursal();
    const [fecha, setFecha] = useState(hoyArgentina());
    const [planilla, setPlanilla] = useState(null);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (!fecha || !sucursalId) {
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
                const datos = await obtenerPlanillaDiaria(fecha);

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
    }, [fecha, sucursalId]);

    const estrella = planilla?.productoEstrella;

    return (
        <div>
            <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                <label htmlFor="planilla-fecha" className="form-label mb-0">
                    Fecha:
                </label>

                <input
                    id="planilla-fecha"
                    type="date"
                    className="form-control w-auto"
                    max={hoyArgentina()}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
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

            {cargando && <p>Cargando planilla diaria...</p>}

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

                    <PlanillaCampo
                        etiqueta="Monto total al cierre (en $)"
                        valor={formatearMonto(planilla.montoTotal)}
                        columnas="col-md-6 mx-auto"
                    />
                </div>
            )}
        </div>
    );
}

export default PlanillaDiaria;