import { useEffect, useState } from "react";
import { crearInventario, modificarInventario } from "../services/inventarioService";
import { obtenerProductos } from "../services/productoService";

const FORMULARIO_VACIO = {
    productoId: "",
    stock: "",
};

// sucursalId llega desde afuera: el inventario se crea siempre para la sucursal
// en la que se está trabajando, por eso ya no se elige acá
function InventarioForm({ sucursalId, inventarioEditar, onInventarioGuardado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [productos, setProductos] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {
        cargarOpciones();
    }, []);

    const cargarOpciones = async () => {
        try {
            const productosObtenidos = await obtenerProductos();

            setProductos(productosObtenidos);
        } catch (error) {
            setError("No se pudieron cargar los productos.");
        }
    };

    useEffect(() => {
        if (inventarioEditar) {
            setFormulario({
                productoId: String(inventarioEditar.productoId),
                stock: String(inventarioEditar.stock),
            });
        }
    }, [inventarioEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (inventarioEditar) {
                // Al modificar solo se cambia el stock
                await modificarInventario(inventarioEditar.id, {
                    stock: Number(formulario.stock),
                });
            } else {
                // El backend espera números, pero los inputs devuelven texto
                await crearInventario({
                    sucursalId: Number(sucursalId),
                    productoId: Number(formulario.productoId),
                    stock: Number(formulario.stock),
                });
            }

            setFormulario(FORMULARIO_VACIO);
            onInventarioGuardado();
        } catch (error) {
            setError(
                error.message ||
                (inventarioEditar
                    ? "No se pudo modificar el inventario."
                    : "No se pudo crear el inventario.")
            );
        }
    };

    const cancelarEdicion = () => {
        setFormulario(FORMULARIO_VACIO);
        setError("");

        onCancelarEdicion();
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {inventarioEditar ? "Editar inventario" : "Nuevo inventario"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Producto</label>
                        <select
                            name="productoId"
                            className="form-select"
                            value={formulario.productoId}
                            onChange={manejarCambio}
                            disabled={Boolean(inventarioEditar)}
                            required
                        >
                            <option value="">Seleccioná un producto</option>
                            {productos.map((producto) => (
                                <option key={producto.idProducto} value={producto.idProducto}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            name="stock"
                            className="form-control"
                            value={formulario.stock}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {inventarioEditar ? "Guardar cambios" : "Crear inventario"}
                    </button>

                    {inventarioEditar && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelarEdicion}
                        >
                            Cancelar
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default InventarioForm;
