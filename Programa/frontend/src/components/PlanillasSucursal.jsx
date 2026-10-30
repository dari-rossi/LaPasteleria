import { useState } from "react";
import PlanillaDiaria from "./PlanillaDiaria";
import PlanillaMensual from "./PlanillaMensual";

function PlanillasSucursal() {
    const [pestania, setPestania] = useState("diaria");

    return (
        <div className="mt-5">
            <h2 className="mb-3">Planillas</h2>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link ${pestania === "diaria" ? "active" : ""}`}
                        onClick={() => setPestania("diaria")}
                    >
                        Diaria
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link ${pestania === "mensual" ? "active" : ""}`}
                        onClick={() => setPestania("mensual")}
                    >
                        Mensual
                    </button>
                </li>
            </ul>

            {pestania === "diaria"
                ? <PlanillaDiaria />
                : <PlanillaMensual />}
        </div>
    );
}

export default PlanillasSucursal;