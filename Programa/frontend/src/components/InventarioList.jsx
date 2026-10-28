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

// Fila con stock por debajo del mínimo: rojo medio, con letras negras legibles
const ESTILO_STOCK_BAJO = {
    "--bs-table-bg": "#e57373",
    "--bs-table-color": "#000"
};

// Fila seleccionada: borde azul, sin cambiar el fondo ni las letras
const ESTILO_FILA_SELECCIONADA = {
    outline: "2px solid #0d6efd",
    outlineOffset: "-2px"
};

// sucursalId llega desde afuera: la sucursal se elige al iniciar el sistema,
// y esta tabla siempre muestra el inventario de esa sucursal
function InventarioList({ sucursalId }) {
    const [inventarios, setInventarios] = useState([]);
    const [error, setError] = useState("");
    const [inventarioEditar, setInventarioEditar] = useState(null);

    // El panel para crear o editar un inventario está oculto hasta que se lo pide
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Fila seleccionada (id del inventario): al elegirla aparecen Editar y Eliminar
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState(null);

    // Filtros: "todos" o "stock-bajo", y el id del producto (vacío = sin filtrar)
    const [filtro, setFiltro] = useState("todos");
    const [idProductoFiltro, setIdProductoFiltro] = useState("");

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
        setMostrarFormulario(false);
    };

    const editarInventario = (inventario) => {
        setInventarioEditar(inventario);
        setMostrarFormulario(true);
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
            setInventarioSeleccionado(null);
        } catch (error) {
            setError("No se pudo eliminar el registro de inventario.");
        }
    };

    const cancelarEdicion = () => {
        setInventarioEditar(null);
        setMostrarFormulario(false);
    };

    // El botón abre el panel para crear un inventario, o lo cierra si ya está abierto
    const alternarFormulario = () => {
        setInventarioEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    // Un clic selecciona la fila y otro clic sobre la misma la deselecciona
    const seleccionarInventario = (id) => {
        setInventarioSeleccionado(inventarioSeleccionado === id ? null : id);
    };

    // Solo el inventario de la sucursal en la que se está trabajando
    const inventariosDeSucursal = inventarios.filter(
        (inventario) => inventario.sucursalId === Number(sucursalId)
    );

    const inventariosFiltrados = inventariosDeSucursal.filter((inventario) => {
        // Stock bajo: el stock llegó al stock mínimo del producto o está por debajo
        const coincideStock =
            filtro === "todos" ||
            inventario.stock <= inventario.producto.stockMin;

        const coincideProducto =
            idProductoFiltro === "" ||
            inventario.producto.idProducto === Number(idProductoFiltro);

        return coincideStock && coincideProducto;
    });

    // El registro elegido solo cuenta si sigue visible con los filtros actuales
    const inventarioElegido = inventariosFiltrados.find(
        (inventario) => inventario.id === inventarioSeleccionado
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Inventario</h2>

                <button
                    className="btn btn-primary"
                    onClick={alternarFormulario}
                >
                    {mostrarFormulario ? "Cerrar" : "+ Crear inventario"}
                </button>
            </div>

            {mostrarFormulario && (
                <InventarioForm
                    sucursalId={sucursalId}
                    inventarioEditar={inventarioEditar}
                    onInventarioGuardado={inventarioGuardado}
                    onCancelarEdicion={cancelarEdicion}
                />
            )}

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
                                <div className="col-md-6 mb-3">
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

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">ID del producto</label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="1"
                                        className="form-control"
                                        value={idProductoFiltro}
                                        onChange={(e) => setIdProductoFiltro(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {inventariosFiltrados.length === 0 && !error ? (
                        <p>No hay productos que coincidan con los filtros.</p>
                    ) : (
                        <>
                            {/* Siempre ocupa el mismo lugar, así la tabla no se mueve al seleccionar */}
                            <div className="d-flex align-items-center mb-3">
                                <span className="flex-grow-1 text-truncate me-3">
                                    {inventarioElegido
                                        ? `Seleccionado: ${inventarioElegido.producto.nombre}`
                                        : "Seleccioná una fila para editar o eliminar"}
                                </span>

                                <div className={`flex-shrink-0 ${inventarioElegido ? "" : "invisible"}`}>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => editarInventario(inventarioElegido)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            borrarInventario(inventarioElegido.id)
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Tipo</th>
                                            <th>Precio</th>
                                            <th>Stock mínimo</th>
                                            <th>Stock</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {inventariosFiltrados.map((inventario) => (
                                            <tr
                                                key={inventario.id}
                                                style={{
                                                    cursor: "pointer",
                                                    ...(inventario.stock < inventario.producto.stockMin
                                                        ? ESTILO_STOCK_BAJO
                                                        : {}),
                                                    ...(inventarioSeleccionado === inventario.id
                                                        ? ESTILO_FILA_SELECCIONADA
                                                        : {})
                                                }}
                                                onClick={() =>
                                                    seleccionarInventario(inventario.id)
                                                }
                                            >
                                                <td>{inventario.producto.idProducto}</td>
                                                <td>{inventario.producto.nombre}</td>
                                                <td>{inventario.producto.tipoProducto}</td>
                                                <td>{formatearPrecio(inventario.producto.precio)}</td>
                                                <td>{inventario.producto.stockMin}</td>
                                                <td>{inventario.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default InventarioList;