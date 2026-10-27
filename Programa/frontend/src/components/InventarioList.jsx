import { useEffect, useState } from "react";
import {
    obtenerInventarios,
    eliminarInventario
} from "../services/inventarioService";
import InventarioForm from "./InventarioForm";

// precioFinal puede venir en null (el backend todavía no lo calcula)
const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) {
        return "—";
    }
    return `$ ${valor.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

// sucursalId llega desde afuera: la sucursal se elige al iniciar el sistema,
// y esta tabla siempre muestra el inventario de esa sucursal
function InventarioList({ sucursalId }) {
    const [inventarios, setInventarios] = useState([]);
    const [error, setError] = useState("");
    const [inventarioEditar, setInventarioEditar] = useState(null);

    // Filtro: "todos" o "stock-bajo"
    const [filtro, setFiltro] = useState("todos");

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

    // Solo el inventario de la sucursal en la que se está trabajando
    const inventariosDeSucursal = inventarios.filter(
        (inventario) => inventario.sucursalId === Number(sucursalId)
    );

    // Stock bajo: el stock llegó al stock mínimo del producto o está por debajo
    const inventariosFiltrados = inventariosDeSucursal.filter(
        (inventario) =>
            filtro === "todos" ||
            inventario.stock <= inventario.producto.stockMin
    );

    return (
        <div>
            <h2 className="mb-3">Inventario</h2>

            <InventarioForm
                sucursalId={sucursalId}
                inventarioEditar={inventarioEditar}
                onInventarioGuardado={inventarioGuardado}
                onCancelarEdicion={cancelarEdicion}
            />

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {inventariosDeSucursal.length === 0 && !error ? (
                <p>No hay registros de inventario.</p>
            ) : (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Mostrar</label>
                                    <select
                                        className="form-select"
                                        value={filtro}
                                        onChange={(e) => setFiltro(e.target.value)}
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="stock-bajo">Stock bajo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {inventariosFiltrados.length === 0 && !error ? (
                        <p>No hay productos con stock bajo.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Proveedor</th>
                                        <th>Stock mínimo</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {inventariosFiltrados.map((inventario) => (
                                        <tr
                                            key={inventario.id}
                                            className={
                                                inventario.stock < inventario.producto.stockMin
                                                    ? "table-danger"
                                                    : ""
                                            }
                                        >
                                            <td>{inventario.producto.idProducto}</td>
                                            <td>{inventario.producto.nombre}</td>
                                            <td>{inventario.producto.tipoProducto}</td>
                                            <td>{inventario.producto.descripcion}</td>
                                            <td>{formatearPrecio(inventario.producto.precio)}</td>
                                            <td>{inventario.producto.proveedor}</td>
                                            <td>{inventario.producto.stockMin}</td>
                                            <td>{inventario.stock}</td>
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
                </>
            )}
        </div>
    );
}

export default InventarioList;
