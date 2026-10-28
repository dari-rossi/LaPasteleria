import { useEffect, useState } from "react";
import { crearInventario, modificarInventario } from "../services/inventarioService";
import { obtenerProductos } from "../services/productoService";

const FORMULARIO_VACIO = {
    productoId: "",
    stock: "",
};

// Para buscar por nombre sin importar tildes ni mayúsculas
const normalizar = (texto) =>
    texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

function InventarioForm({ sucursalId, inventarioEditar, onInventarioGuardado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [productos, setProductos] = useState([]);

    // El producto se puede buscar por ID o por nombre (cualquiera de los dos, son opcionales).
    // Al elegirlo por uno de los dos, el otro se completa solo.
    const [idEscrito, setIdEscrito] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [mostrarOpciones, setMostrarOpciones] = useState(false);

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
            setIdEscrito(String(inventarioEditar.productoId));
            setBusqueda(inventarioEditar.producto.nombre);
        }
    }, [inventarioEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    // Búsqueda por ID: si existe un producto con ese ID, queda elegido y se completa el nombre
    const cambiarId = (e) => {
        const valor = e.target.value;
        const producto = productos.find(
            (producto) => String(producto.idProducto) === valor.trim()
        );

        setIdEscrito(valor);
        setMostrarOpciones(false);

        if (producto) {
            setFormulario({ ...formulario, productoId: String(producto.idProducto) });
            setBusqueda(producto.nombre);
        } else {
            setFormulario({ ...formulario, productoId: "" });
            setBusqueda("");
        }
    };

    // Búsqueda por nombre: solo se sugiere cuando ya se escribió algo,
    // así no aparece una lista enorme
    const opciones =
        busqueda.trim() === ""
            ? []
            : productos.filter((producto) =>
                  normalizar(producto.nombre).includes(normalizar(busqueda))
              );

    const cambiarBusqueda = (e) => {
        setBusqueda(e.target.value);
        // Si se vuelve a escribir, hay que elegir de nuevo un producto de la lista
        setFormulario({ ...formulario, productoId: "" });
        setIdEscrito("");
        setMostrarOpciones(true);
    };

    const seleccionarProducto = (producto) => {
        setFormulario({ ...formulario, productoId: String(producto.idProducto) });
        setBusqueda(producto.nombre);
        setIdEscrito(String(producto.idProducto));
        setMostrarOpciones(false);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        if (!inventarioEditar && formulario.productoId === "") {
            setError("Elegí un producto: escribí su ID o buscalo por nombre.");
            return;
        }

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
            setIdEscrito("");
            setBusqueda("");
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
        setIdEscrito("");
        setBusqueda("");
        setError("");

        onCancelarEdicion();
    };

    // Se escribió un ID pero no existe ningún producto con ese número
    const idInexistente = idEscrito.trim() !== "" && formulario.productoId === "";

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
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">ID del producto</label>
                            <input
                                type="number"
                                step="1"
                                min="1"
                                className="form-control"
                                value={idEscrito}
                                onChange={cambiarId}
                                disabled={Boolean(inventarioEditar)}
                            />

                            {idInexistente && (
                                <div className="form-text text-danger">
                                    No existe un producto con ese ID
                                </div>
                            )}
                        </div>

                        <div className="col-md-8 mb-3 position-relative">
                            <label className="form-label">Nombre del producto</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Escribí el nombre del producto"
                                autoComplete="off"
                                value={busqueda}
                                onChange={cambiarBusqueda}
                                onFocus={() => setMostrarOpciones(true)}
                                onBlur={() => setMostrarOpciones(false)}
                                disabled={Boolean(inventarioEditar)}
                            />

                            {mostrarOpciones && busqueda.trim() !== "" && (
                                <ul
                                    className="list-group position-absolute w-100 shadow-sm"
                                    style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
                                >
                                    {opciones.length === 0 ? (
                                        <li className="list-group-item text-muted">
                                            No hay productos con ese nombre
                                        </li>
                                    ) : (
                                        opciones.map((producto) => (
                                            <li
                                                key={producto.idProducto}
                                                className="list-group-item list-group-item-action"
                                                style={{ cursor: "pointer" }}
                                                // onMouseDown evita que el campo pierda el foco antes de elegir
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    seleccionarProducto(producto);
                                                }}
                                            >
                                                {producto.nombre}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
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