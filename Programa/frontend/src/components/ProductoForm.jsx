import { useEffect, useState } from "react";
import { crearProducto, modificarProducto } from "../services/productoService";

const FORMULARIO_VACIO = {
    nombre: "",
    tipoProducto: "",
    descripcion: "",
    precio: "",
    proveedor: ""
};

function ProductoForm({ productoEditar, onProductoCreado, onProductoModificado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);

    const [error, setError] = useState("");

    useEffect(() => {
        if (productoEditar) {
            setFormulario({
                nombre: productoEditar.nombre,
                tipoProducto: productoEditar.tipoProducto,
                descripcion: productoEditar.descripcion ?? "",
                precio: String(productoEditar.precio),
                proveedor: productoEditar.proveedor
            });
        }
    }, [productoEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        // El input devuelve texto, pero el backend espera que precio sea un número
        const datos = {
            ...formulario,
            precio: Number(formulario.precio)
        };

        try {
            if (productoEditar) {
                const productoModificado = await modificarProducto(
                    productoEditar.idProducto,
                    datos
                );

                onProductoModificado(productoModificado);
            } else {
                const nuevoProducto = await crearProducto(datos);

                onProductoCreado(nuevoProducto);
            }

            setFormulario(FORMULARIO_VACIO);
        } catch (error) {
            setError(
                error.message ||
                (productoEditar
                    ? "No se pudo modificar el producto."
                    : "No se pudo crear el producto.")
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
                    {productoEditar ? "Editar producto" : "Nuevo producto"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tipo de producto</label>
                        <input
                            type="text"
                            name="tipoProducto"
                            className="form-control"
                            value={formulario.tipoProducto}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción (opcional)</label>
                        <input
                            type="text"
                            name="descripcion"
                            className="form-control"
                            value={formulario.descripcion}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="precio"
                            className="form-control"
                            value={formulario.precio}
                            onChange={manejarCambio}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Proveedor</label>
                        <input
                            type="text"
                            name="proveedor"
                            className="form-control"
                            value={formulario.proveedor}
                            onChange={manejarCambio}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {productoEditar ? "Guardar cambios" : "Crear producto"}
                    </button>

                    {productoEditar && (
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

export default ProductoForm;