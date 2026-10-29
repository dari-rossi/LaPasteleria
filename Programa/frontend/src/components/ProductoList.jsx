import { useEffect, useState } from "react";
import {
    obtenerProductos,
    eliminarProducto
} from "../services/productoService";
import ProductoForm from "./ProductoForm";

const PRODUCTOS_POR_PAGINA = 10;

// Los tipos de producto se guardan tal cual: "Día", "Noche" o "Ambos"
const TIPOS_PRODUCTO = ["Día", "Noche", "Ambos"];

// precioFinal puede venir en null (el backend todavía no lo calcula)
const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) {
        return "—";
    }
    return `$ ${valor.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

// Botones Editar y Eliminar: suaves por defecto, con el color fuerte al pasar el mouse
const ESTILO_BOTON_EDITAR = {
    "--bs-btn-bg": "#fff3cd",
    "--bs-btn-border-color": "#ffe69c",
    "--bs-btn-color": "#664d03",
    "--bs-btn-hover-bg": "#ffc107",
    "--bs-btn-hover-border-color": "#ffc107",
    "--bs-btn-hover-color": "#000"
};

const ESTILO_BOTON_ELIMINAR = {
    "--bs-btn-bg": "#f8d7da",
    "--bs-btn-border-color": "#f1aeb5",
    "--bs-btn-color": "#58151c",
    "--bs-btn-hover-bg": "#dc3545",
    "--bs-btn-hover-border-color": "#dc3545",
    "--bs-btn-hover-color": "#fff"
};

// Fila seleccionada: borde gris separado de la fila, igual que las mesas
const ESTILO_FILA_SELECCIONADA = {
    outline: "4px solid #757575",
    outlineOffset: "2px"
};

// Deja un margen alrededor de la tabla para que el borde de la fila seleccionada no se corte
// (el margen negativo compensa el relleno, así la tabla queda alineada igual que antes)
const ESTILO_CONTENEDOR_TABLA = {
    padding: 8,
    margin: -8
};

function ProductoList() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [productoEditar, setProductoEditar] = useState(null);

    // El panel para crear o editar un producto está oculto hasta que se lo pide
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Fila seleccionada (idProducto): al elegirla aparecen Editar y Eliminar
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // Filtro y paginación
    const [tipoProducto, setTipoProducto] = useState("todos");
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const datos = await obtenerProductos();
            setProductos(datos);
        } catch (error) {
            setError(error.message);
        }
    };

    const agregarProducto = (nuevoProducto) => {
        setProductos([...productos, nuevoProducto]);
        setMostrarFormulario(false);
    };

    const editarProducto = (producto) => {
        setProductoEditar(producto);
        setMostrarFormulario(true);
    };

    const actualizarProducto = (productoModificado) => {
        setProductos(
            productos.map((producto) =>
                producto.idProducto === productoModificado.idProducto
                    ? productoModificado
                    : producto
            )
        );

        setProductoEditar(null);
        setMostrarFormulario(false);
    };

    const borrarProducto = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar este producto?"
        );

        if (!confirmar) {
            return;
        }
        setError("");

        try {
            await eliminarProducto(id);

            setProductos(
                productos.filter((producto) => producto.idProducto !== id)
            );
            setProductoSeleccionado(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const cancelarEdicion = () => {
        setProductoEditar(null);
        setMostrarFormulario(false);
    };

    // El botón abre el panel para crear un producto, o lo cierra si ya está abierto
    const alternarFormulario = () => {
        setProductoEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    // Un clic selecciona la fila y otro clic sobre la misma la deselecciona
    const seleccionarProducto = (id) => {
        setProductoSeleccionado(productoSeleccionado === id ? null : id);
    };

    const cambiarTipoProducto = (e) => {
        setTipoProducto(e.target.value);
        setPagina(1);
    };

    const productosFiltrados = productos.filter(
        (producto) =>
            tipoProducto === "todos" ||
            producto.tipoProducto === tipoProducto ||
            // Un producto de ambos turnos también se muestra al filtrar por día o por noche
            (producto.tipoProducto === "Ambos" &&
                (tipoProducto === "Día" || tipoProducto === "Noche"))
    );

    // El producto elegido solo cuenta si sigue visible con el filtro actual
    const productoElegido = productosFiltrados.find(
        (producto) => producto.idProducto === productoSeleccionado
    );

    const totalPaginas = Math.max(
        1,
        Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA)
    );

    // Si al borrar quedan menos páginas, no se pasa del final
    const paginaActual = Math.min(pagina, totalPaginas);

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const productosDePagina = productosFiltrados.slice(
        inicio,
        inicio + PRODUCTOS_POR_PAGINA
    );

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Productos</h2>

                <button
                    className="btn btn-primary"
                    onClick={alternarFormulario}
                >
                    {mostrarFormulario ? "Cerrar" : "+ Crear producto"}
                </button>
            </div>

            {mostrarFormulario && (
                <ProductoForm
                    productoEditar={productoEditar}
                    onProductoCreado={agregarProducto}
                    onProductoModificado={actualizarProducto}
                    onCancelarEdicion={cancelarEdicion}
                />
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {productos.length === 0 && !error ? (
                <p>No hay productos registrados.</p>
            ) : (
                <>
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Tipo de producto</label>
                                    <select
                                        className="form-select"
                                        value={tipoProducto}
                                        onChange={cambiarTipoProducto}
                                    >
                                        <option value="todos">Todos</option>
                                        {TIPOS_PRODUCTO.map((tipo) => (
                                            <option key={tipo} value={tipo}>
                                                {tipo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {productosFiltrados.length === 0 && !error ? (
                        <p>No hay productos que coincidan con el filtro.</p>
                    ) : (
                        <>
                            {/* Siempre ocupa el mismo lugar, así la tabla no se mueve al seleccionar */}
                            <div className="d-flex align-items-center mb-3">
                                <span className="flex-grow-1 text-truncate me-3">
                                    {productoElegido
                                        ? `Seleccionado: ${productoElegido.nombre}`
                                        : "Seleccioná una fila para editar o eliminar"}
                                </span>

                                <div className={`flex-shrink-0 ${productoElegido ? "" : "invisible"}`}>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        style={ESTILO_BOTON_EDITAR}
                                        onClick={() => editarProducto(productoElegido)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        style={ESTILO_BOTON_ELIMINAR}
                                        onClick={() =>
                                            borrarProducto(productoElegido.idProducto)
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive" style={ESTILO_CONTENEDOR_TABLA}>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Tipo</th>
                                            <th>Descripción</th>
                                            <th>Precio</th>
                                            <th>Proveedor</th>
                                            <th>Stock mínimo</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productosDePagina.map((producto) => (
                                            <tr
                                                key={producto.idProducto}
                                                style={{
                                                    cursor: "pointer",
                                                    ...(productoSeleccionado === producto.idProducto
                                                        ? ESTILO_FILA_SELECCIONADA
                                                        : {})
                                                }}
                                                onClick={() =>
                                                    seleccionarProducto(producto.idProducto)
                                                }
                                            >
                                                <td>{producto.idProducto}</td>
                                                <td>{producto.nombre}</td>
                                                <td>{producto.tipoProducto}</td>
                                                <td>{producto.descripcion}</td>
                                                <td>{formatearPrecio(producto.precio)}</td>
                                                <td>{producto.proveedor}</td>
                                                <td>{producto.stockMinimo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => setPagina(paginaActual - 1)}
                                    disabled={paginaActual === 1}
                                >
                                    Anterior
                                </button>

                                <span>
                                    Página {paginaActual} de {totalPaginas}
                                </span>

                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => setPagina(paginaActual + 1)}
                                    disabled={paginaActual === totalPaginas}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default ProductoList;