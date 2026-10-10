import { useEffect, useState } from "react";
import { obtenerGastos, eliminarGasto } from "../services/gastoService";
import { obtenerSucursales } from "../services/sucursalService";
import GastoForm from "./GastoForm";

// La fecha llega como "2026-10-06T00:00:00.000Z". Se arma a mano (sin new Date)
// para que la zona horaria no la corra un día
const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.slice(0, 10).split("-");

    return `${dia}/${mes}/${anio}`;
};

const formatearCosto = (costo) => {
    return Number(costo).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });
};

function GastoList() {
    const [gastos, setGastos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [error, setError] = useState("");
    const [gastoEditar, setGastoEditar] = useState(null);

    // Filtros del listado (los dos son opcionales y se combinan)
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroSucursalId, setFiltroSucursalId] = useState("");

    // Cada vez que cambia este número se vuelve a pedir la lista
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelado = false;

        const cargarSucursales = async () => {
            try {
                const datos = await obtenerSucursales();

                if (!cancelado) {
                    setSucursales(datos);
                }
            } catch {
                if (!cancelado) {
                    setError("No se pudieron cargar las sucursales.");
                }
            }
        };

        cargarSucursales();

        return () => {
            cancelado = true;
        };
    }, []);

    useEffect(() => {
        let cancelado = false;

        const cargarGastos = async () => {
            try {
                const datos = await obtenerGastos({
                    nombre: filtroNombre.trim(),
                    sucursalId: filtroSucursalId
                });

                if (!cancelado) {
                    setGastos(datos);
                    setError("");
                }
            } catch {
                if (!cancelado) {
                    setError("No se pudieron cargar los gastos.");
                }
            }
        };

        cargarGastos();

        // Si se escribe rápido, la respuesta vieja no pisa a la nueva
        return () => {
            cancelado = true;
        };
    }, [filtroNombre, filtroSucursalId, version]);

    const recargar = () => {
        setVersion((actual) => actual + 1);
    };

    // Se usa tanto al crear como al modificar: se vuelve a pedir la lista
    // para respetar el orden y los filtros que estén puestos
    const gastoGuardado = () => {
        setGastoEditar(null);
        recargar();
    };

    const editarGasto = (gasto) => {
        setGastoEditar(gasto);
    };

    const borrarGasto = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar este gasto?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarGasto(id);

            if (gastoEditar && gastoEditar.id === id) {
                setGastoEditar(null);
            }

            recargar();
        } catch (error) {
            setError(error.message || "No se pudo eliminar el gasto.");
        }
    };

    const cancelarEdicion = () => {
        setGastoEditar(null);
    };

    // Suma de los gastos que se están viendo (respeta los filtros)
    const total = Math.round(
        gastos.reduce((suma, gasto) => suma + gasto.costo, 0) * 100
    ) / 100;

    const hayFiltros = filtroNombre.trim() !== "" || filtroSucursalId !== "";

    return (
        <div>
            <h2 className="mb-3">Gastos</h2>

            <GastoForm
                gastoEditar={gastoEditar}
                onGastoGuardado={gastoGuardado}
                onCancelarEdicion={cancelarEdicion}
            />

            <div className="row g-2 mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre"
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>

                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={filtroSucursalId}
                        onChange={(e) => setFiltroSucursalId(e.target.value)}
                    >
                        <option value="">Todas las sucursales</option>
                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.id} - {sucursal.direccion}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {gastos.length === 0 && !error ? (
                <p>
                    {hayFiltros
                        ? "No hay gastos que coincidan con la búsqueda."
                        : "No hay gastos registrados."}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Costo</th>
                                <th>Fecha</th>
                                <th>Sucursal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {gastos.map((gasto) => (
                                <tr key={gasto.id}>
                                    <td>{gasto.id}</td>
                                    <td>{gasto.nombre}</td>
                                    <td>{formatearCosto(gasto.costo)}</td>
                                    <td>{formatearFecha(gasto.fechaGasto)}</td>
                                    <td>{gasto.sucursal.direccion}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => editarGasto(gasto)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => borrarGasto(gasto.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr>
                                <th colSpan="2">Total de los gastos</th>
                                <th colSpan="4">{formatearCosto(total)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

export default GastoList;
