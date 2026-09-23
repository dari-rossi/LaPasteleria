import { useEffect, useState } from "react";
import {
    obtenerSucursales,
    eliminarSucursal
} from "../services/sucursalService";
import SucursalForm from "./SucursalForm";

function SucursalList() {
    const [sucursales, setSucursales] = useState([]);
    const [error, setError] = useState("");
    const [sucursalEditar, setSucursalEditar] = useState(null);

    useEffect(() => {
        cargarSucursales();
    }, []);

    const cargarSucursales = async () => {
        try {
            const datos = await obtenerSucursales();
            setSucursales(datos);
        } catch (error) {
            setError("No se pudieron cargar las sucursales.");
        }
    };

    const agregarSucursal = (nuevaSucursal) => {
        setSucursales([...sucursales, nuevaSucursal]);
    };

    const editarSucursal = (sucursal) => {
        setSucursalEditar(sucursal);
    };

    const actualizarSucursal = (sucursalModificada) => {
        setSucursales(
            sucursales.map((sucursal) =>
                sucursal.id === sucursalModificada.id
                    ? sucursalModificada
                    : sucursal
            )
        );

        setSucursalEditar(null);
    };

    const borrarSucursal = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar esta sucursal?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarSucursal(id);

            setSucursales(
                sucursales.filter((sucursal) => sucursal.id !== id)
            );
        } catch (error) {
            setError("No se pudo eliminar la sucursal.");
        }
    };

    const cancelarEdicion = () => {
        setSucursalEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Sucursales</h2>

            <SucursalForm
                sucursalEditar={sucursalEditar}
                onSucursalCreada={agregarSucursal}
                onSucursalModificada={actualizarSucursal}
                onCancelarEdicion={cancelarEdicion}
            />

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {sucursales.length === 0 && !error ? (
                <p>No hay sucursales registradas.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Código Postal</th>
                                <th>Horarios</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sucursales.map((sucursal) => (
                                <tr key={sucursal.id}>
                                    <td>{sucursal.id}</td>
                                    <td>{sucursal.telefono}</td>
                                    <td>{sucursal.direccion}</td>
                                    <td>{sucursal.codigoPostal}</td>
                                    <td>{sucursal.horarios}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                editarSucursal(sucursal)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                borrarSucursal(sucursal.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SucursalList;