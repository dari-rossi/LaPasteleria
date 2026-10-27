import { useEffect, useState } from "react";
import {
    obtenerProductos,
    eliminarProducto
} from "../services/productoService";
import ProductoForm from "./ProductoForm";

const PRODUCTOS_POR_PAGINA = 10;

const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) {
        return "—";
    }
    return `$ ${valor.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

// Los tipos de producto son día y noche; se comparan sin tildes ni mayúsculas
// para que "día", "Dia" o "dia" cuenten como lo mismo
const normalizar = (texto) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

function ProductoList() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [productoEditar, setProductoEditar] = useState(null);

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
            setError("No se pudieron cargar los productos.");
        }
    };

    const agregarProducto = (nuevoProducto) => {
        setProductos([...productos, nuevoProducto]);
    };

    const editarProducto = (producto) => {
        setProductoEditar(producto);
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

            setProductos(
                productos.filter((producto) => producto.idProducto !== id)
            );
        } catch (error) {
            setError("No se pudo eliminar el producto.");
        }
    };

    const cancelarEdicion = () => {
        setProductoEditar(null);
    };

    const cambiarTipoProducto = (e) => {
        setTipoProducto(e.target.value);
        setPagina(1);
    };

    const productosFiltrados = productos.filter(
        (producto) =>
            tipoProducto === "todos" ||
            normalizar(producto.tipoProducto) === tipoProducto
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
            <h2 className="mb-3">Productos</h2>

            <ProductoForm
                productoEditar={productoEditar}
                onProductoCreado={agregarProducto}
                onProductoModificado={actualizarProducto}
                onCancelarEdicion={cancelarEdicion}
            />

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
                                        <option value="dia">Día</option>
                                        <option value="noche">Noche</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {productosFiltrados.length === 0 && !error ? (
                        <p>No hay productos que coincidan con el filtro.</p>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Tipo</th>
                                            <th>Descripción</th>
                                            <th>Stock mínimo</th>
                                            <th>Precio</th>
                                            <th>Proveedor</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productosDePagina.map((producto) => (
                                            <tr key={producto.idProducto}>
                                                <td>{producto.idProducto}</td>
                                                <td>{producto.nombre}</td>
                                                <td>{producto.tipoProducto}</td>
                                                <td>{producto.descripcion}</td>
                                                <td>{producto.stockMin}</td>
                                                <td>{formatearPrecio(producto.precio)}</td>
                                                <td>{producto.proveedor}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning btn-sm me-2"
                                                        onClick={() =>
                                                            editarProducto(producto)
                                                        }
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            borrarProducto(producto.idProducto)
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
