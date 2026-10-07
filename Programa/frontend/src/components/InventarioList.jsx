import { useEffect, useState } from "react";
import {
    obtenerInventarios,
    eliminarInventario
} from "../services/inventarioService";
import InventarioForm from "./InventarioForm";

function InventarioList() {
    const [inventarios, setInventarios] = useState([]);
    const [error, setError] = useState("");
    const [inventarioEditar, setInventarioEditar] = useState(null);

    useEffect(() => {
        cargarInventarios();
    }, []);

    const cargarInventarios = async () => {
        try {
            const datos = await obtenerInventarios();
            setInventarios(datos);
            setError("");
        } catch (error) {
            setError("No se pudo cargar el inventario.");
        }
    };

    // Se usa tanto al crear como al modificar: se vuelve a pedir la lista
    // porque el backend no devuelve sucursal ni producto en esas respuestas
    const inventarioGuardado = () => {
        cargarInventarios();
        setInventarioEditar(null);
    };

    const editarInventario = (inventario) => {
        setInventarioEditar(inventario);
    };

    const borrarInventario = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar este registro de inventario?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarInventario(id);

            setInventarios(
                inventarios.filter((inventario) => inventario.id !== id)
            );
        } catch (error) {
            setError("No se pudo eliminar el registro de inventario.");
        }
    };

    const cancelarEdicion = () => {
        setInventarioEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Inventario</h2>

            <InventarioForm
                inventarioEditar={inventarioEditar}
                onInventarioGuardado={inventarioGuardado}
                onCancelarEdicion={cancelarEdicion}
            />

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {inventarios.length === 0 && !error ? (
                <p>No hay registros de inventario.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Sucursal</th>
                                <th>Producto</th>
                                <th>Stock</th>
                                <th>Stock mínimo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {inventarios.map((inventario) => (
                                <tr
                                    key={inventario.id}
                                    className={
                                        inventario.stock < inventario.stockMin
                                            ? "table-danger"
                                            : ""
                                    }
                                >
                                    <td>{inventario.id}</td>
                                    <td>{inventario.sucursal.direccion}</td>
                                    <td>{inventario.producto.nombre}</td>
                                    <td>{inventario.stock}</td>
                                    <td>{inventario.stockMin}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                editarInventario(inventario)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                borrarInventario(inventario.id)
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

export default InventarioList;