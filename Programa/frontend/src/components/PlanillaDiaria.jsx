import { useEffect, useState } from "react";
import { obtenerPlanillaDiaria } from "../services/planillaService";
import { hoyArgentina, formatearMonto, formatearId } from "../models/Planilla";
import PlanillaCampo from "./PlanillaCampo";

function PlanillaDiaria() {
    const [fecha, setFecha] = useState(hoyArgentina());
    const [planilla, setPlanilla] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!fecha) {
            setPlanilla(null);
            return;
        }

        let vigente = true;

        const cargar = async () => {
            try {
                const datos = await obtenerPlanillaDiaria(fecha);

                if (vigente) {
                    setPlanilla(datos);
                    setError("");
                }
            } catch (error) {
                if (vigente) {
                    setPlanilla(null);
                    setError(error.message);
                }
            }
        };

        cargar();

        return () => {
            vigente = false;
        };
    }, [fecha]);

    const estrella = planilla?.productoEstrella;

    return (
        <div>
            <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                <label htmlFor="planilla-fecha" className="form-label mb-0">Fecha:</label>
                <input
                    id="planilla-fecha"
                    type="date"
                    className="form-control w-auto"
                    max={hoyArgentina()}
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {planilla && (
                <div className="row g-3">
                    <PlanillaCampo etiqueta="Ventas" valor={planilla.ventas} />
                    <PlanillaCampo
                        etiqueta="Monto promedio por venta (en $)"
                        valor={formatearMonto(planilla.montoPromedioPorVenta)}
                    />
                    <PlanillaCampo etiqueta="Total de clientes" valor={planilla.totalClientes} />
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