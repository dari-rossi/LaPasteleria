import { useEffect, useState } from "react";
import { obtenerPlanillaMensual } from "../services/planillaService";
import { mesActualArgentina, formatearMonto, formatearId } from "../models/Planilla";
import PlanillaCampo from "./PlanillaCampo";

function PlanillaMensual() {
    const [mes, setMes] = useState(mesActualArgentina());
    const [planilla, setPlanilla] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!mes) {
            setPlanilla(null);
            return;
        }

        let vigente = true;

        const cargar = async () => {
            try {
                const datos = await obtenerPlanillaMensual(mes);

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
    }, [mes]);

    const estrella = planilla?.productoEstrella;

    return (
        <div>
            <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                <label htmlFor="planilla-mes" className="form-label mb-0">Mes:</label>
                <input
                    id="planilla-mes"
                    type="month"
                    className="form-control w-auto"
                    max={mesActualArgentina()}
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
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
                </div>
            )}
        </div>
    );
}

export default PlanillaMensual;