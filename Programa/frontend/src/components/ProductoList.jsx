import { useEffect, useState } from "react";
import {
    obtenerProductos,
    eliminarProducto
} from "../services/productoService";
import ProductoForm from "./ProductoForm";

// precioFinal puede venir en null (el backend todavía no lo calcula)
const formatearPrecio = (valor) => {
    if (valor === null || valor === undefined) {
        return "—";
    }
    return `$ ${valor.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};

function ProductoList() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState("");
    const [productoEditar, setProductoEditar] = useState(null);

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
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Precio final</th>
                                <th>Proveedor</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.idProducto}>
                                    <td>{producto.idProducto}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.tipoProducto}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{formatearPrecio(producto.precio)}</td>
                                    <td>{formatearPrecio(producto.precioFinal)}</td>
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
            )}
        </div>
    );
}

export default ProductoList;