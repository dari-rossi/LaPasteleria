import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    obtenerProductos,
    eliminarProducto
} from "../services/productoService";
import ProductoForm from "./ProductoForm";

const PRODUCTOS_POR_PAGINA = 10;

const TIPOS_PRODUCTO = ["Día", "Noche", "Ambos"];

const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) {
        return "—";
    }

    return `$ ${valor.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

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

const ESTILO_FILA_SELECCIONADA = {
    outline: "4px solid #757575",
    outlineOffset: "2px"
};

const ESTILO_CONTENEDOR_TABLA = {
    padding: 8,
    margin: -8
};

function ProductoList() {
    const { sesion } = useAuth();
    const esDuenio = sesion?.rol === "DUENIO";

    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [productoEditar, setProductoEditar] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [tipoProducto, setTipoProducto] = useState("todos");
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const datos = await obtenerProductos();

            setProductos(
                [...datos].sort((a, b) => a.idProducto - b.idProducto)
            );
        } catch (error) {
            setError("No se pudieron cargar los productos.");
        }
    };

    const agregarProducto = (nuevoProducto) => {
        setProductos((anteriores) =>
            [...anteriores, nuevoProducto].sort(
                (a, b) => a.idProducto - b.idProducto
            )
        );

        setMostrarFormulario(false);
    };

    const editarProducto = (producto) => {
        setProductoEditar(producto);
        setMostrarFormulario(true);
    };

    const actualizarProducto = (productoModificado) => {
        setProductos((anteriores) =>
            anteriores.map((producto) =>
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

        try {
            await eliminarProducto(id);

            setProductos((anteriores) =>
                anteriores.filter((producto) => producto.idProducto !== id)
            );

            setProductoSeleccionado(null);
        } catch (error) {
            setError("No se pudo eliminar el producto.");
        }
    };

    const cancelarEdicion = () => {
        setProductoEditar(null);
        setMostrarFormulario(false);
    };

    const alternarFormulario = () => {
        setProductoEditar(null);
        setMostrarFormulario(!mostrarFormulario);
    };

    const seleccionarProducto = (id) => {
        setProductoSeleccionado(
            productoSeleccionado === id ? null : id
        );
    };

    const cambiarTipoProducto = (e) => {
        setTipoProducto(e.target.value);
        setPagina(1);
        setProductoSeleccionado(null);
    };

    const productosFiltrados = productos.filter(
        (producto) =>
            tipoProducto === "todos" ||
            producto.tipoProducto === tipoProducto ||
            (producto.tipoProducto === "Ambos" &&
                (tipoProducto === "Día" || tipoProducto === "Noche"))
    );

    const productoElegido = productosFiltrados.find(
        (producto) => producto.idProducto === productoSeleccionado
    );

    const totalPaginas = Math.max(
        1,
        Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA)
    );

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

                {esDuenio && (
                    <button
                        className="btn btn-primary"
                        onClick={alternarFormulario}
                    >
                        {mostrarFormulario ? "Cerrar" : "+ Crear producto"}
                    </button>
                )}
            </div>

            {esDuenio && mostrarFormulario && (
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
                                    <label className="form-label">
                                        Tipo de producto
                                    </label>

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

                    {productosFiltrados.length === 0 ? (
                        <p>No hay productos que coincidan con el filtro.</p>
                    ) : (
                        <>
                            <div className="d-flex align-items-center mb-3">
                                <span className="flex-grow-1 text-truncate me-3">
                                    {productoElegido
                                        ? `Seleccionado: ${productoElegido.nombre}`
                                        : esDuenio
                                            ? "Seleccioná una fila para editar o eliminar"
                                            : "Seleccioná una fila para consultar"}
                                </span>

                                {esDuenio && (
                                    <div className={`flex-shrink-0 ${productoElegido ? "" : "invisible"}`}>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            style={ESTILO_BOTON_EDITAR}
                                            disabled={!productoElegido}
                                            onClick={() => editarProducto(productoElegido)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            style={ESTILO_BOTON_ELIMINAR}
                                            disabled={!productoElegido}
                                            onClick={() =>
                                                borrarProducto(productoElegido.idProducto)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div
                                className="table-responsive"
                                style={ESTILO_CONTENEDOR_TABLA}
                            >
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