import { useEffect, useState } from "react";
import { crearInventario, modificarInventario } from "../services/inventarioService";
import { obtenerSucursales } from "../services/sucursalService";
import { obtenerProductos } from "../services/productoService";

const FORMULARIO_VACIO = {
    sucursalId: "",
    productoId: "",
    stock: "",
    stockMin: ""
};

function InventarioForm({ inventarioEditar, onInventarioGuardado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [sucursales, setSucursales] = useState([]);
    const [productos, setProductos] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {
        cargarOpciones();
    }, []);

    const cargarOpciones = async () => {
        try {
            const [sucursalesObtenidas, productosObtenidos] = await Promise.all([
                obtenerSucursales(),
                obtenerProductos()
            ]);

            setSucursales(sucursalesObtenidas);
            setProductos(productosObtenidos);
        } catch (error) {
            setError("No se pudieron cargar las sucursales y los productos.");
        }
    };

    useEffect(() => {
        if (inventarioEditar) {
            setFormulario({
                sucursalId: String(inventarioEditar.sucursalId),
                productoId: String(inventarioEditar.productoId),
                stock: String(inventarioEditar.stock),
                stockMin: String(inventarioEditar.stockMin)
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
                // Al modificar solo se cambian los stocks
                await modificarInventario(inventarioEditar.id, {
                    stock: Number(formulario.stock),
                    stockMin: Number(formulario.stockMin)
                });
            } else {
                // El backend espera números, pero los inputs devuelven texto
                await crearInventario({
                    sucursalId: Number(formulario.sucursalId),
                    productoId: Number(formulario.productoId),
                    stock: Number(formulario.stock),
                    stockMin: Number(formulario.stockMin)
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
                        <label className="form-label">Sucursal</label>
                        <select
                            name="sucursalId"
                            className="form-select"
                            value={formulario.sucursalId}
                            onChange={manejarCambio}
                            disabled={Boolean(inventarioEditar)}
                            required
                        >
                            <option value="">Seleccioná una sucursal</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.id} - {sucursal.direccion}
                                </option>
                            ))}
                        </select>
                    </div>

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

                    <div className="mb-3">
                        <label className="form-label">Stock mínimo</label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            name="stockMin"
                            className="form-control"
                            value={formulario.stockMin}
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