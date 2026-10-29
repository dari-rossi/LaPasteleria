import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerPedidoPorId, modificarPedido } from "../services/pedidoService";
import { obtenerProductos } from "../services/productoService";
import { agregarItem, modificarCantidad, quitarItem } from "../services/itemProductoService";
import { crearPago } from "../services/pagoService";
import MercadoPago from "./mercadoPago/mercadoPago";
import {
    ESTADOS_EDITABLES,
    METODOS_PAGO,
    COLORES_ESTADO_PEDIDO,
    calcularTotal,
    calcularTotalConDescuento,
    pedidoEditable,
    productoDisponibleAhora,
    formatearPrecio
} from "../models/Pedido";

function PedidoDetalle() {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [pedido, setPedido] = useState(null);
    const [productos, setProductos] = useState([]);
    const [estado, setEstado] = useState("");
    const [comensales, setComensales] = useState("");
    const [productoId, setProductoId] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [metodoPago, setMetodoPago] = useState("");
    const [mostrarQR, setMostrarQR] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const recargar = async () => {
        const datos = await obtenerPedidoPorId(id);
        setPedido(datos);
        setEstado(datos.estadoPedido);
        setComensales(datos.comensales);
    };

    useEffect(() => {
        const cargar = async () => {
            try {
                await recargar();
                setProductos(await obtenerProductos());
            } catch (error) {
                setError("No se pudo cargar el pedido.");
            }
        };

        cargar();
    }, [id]);

    const ejecutar = async (accion, textoOk) => {
        setError("");
        setMensaje("");

        try {
            await accion();
            await recargar();
            setMensaje(textoOk);
        } catch (error) {
            setError(error.message);
        }
    };

    const agregarProducto = () => {
        if (!productoId) {
            setError("Elegí un producto.");
            return;
        }

        ejecutar(
            () => agregarItem({
                pedidoId: Number(id),
                productoId: Number(productoId),
                cantidad: Number(cantidad)
            }),
            "Producto agregado."
        ).then(() => {
            setProductoId("");
            setCantidad(1);
        });
    };

    const guardar = () => {
        if (estado === "Cancelado" &&
            !window.confirm("¿Cancelar el pedido? Se libera la mesa y se devuelve el stock.")) {
            return;
        }

        ejecutar(
            () => modificarPedido(id, {
                estadoPedido: estado,
                comensales: Number(comensales)
            }),
            "Pedido actualizado."
        );
    };

    const pagar = async () => {
        setError("");
        setMensaje("");

        if (!metodoPago) {
            setError("Elegí un método de pago.");
            return;
        }

        if (metodoPago === "MercadoPago") {
            setMostrarQR(true);
            return;
        }

        await ejecutar(
            () => crearPago({
                idPedido: Number(id),
                metodoPago
            }),
            "Pedido pagado."
        );
    };

    if (error && !pedido) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!pedido) {
        return <p>Cargando pedido...</p>;
    }

    const editable = pedidoEditable(pedido);
    const descuento = pedido.cliente?.descuento ?? 0;
    const subtotal = pedido.pago?.precio ?? calcularTotal(pedido);
    const total = pedido.pago?.precioFinal ?? calcularTotalConDescuento(pedido);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                    Pedido #{pedido.idPedido}{" "}
                    <span className={`badge ${COLORES_ESTADO_PEDIDO[pedido.estadoPedido]}`}>
                        {pedido.estadoPedido}
                    </span>
                </h2>
                <Link to="/pedidos" className="btn btn-outline-secondary">
                    Volver al listado
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {mensaje && <div className="alert alert-success">{mensaje}</div>}

            {!editable && (
                <div className="alert alert-secondary">
                    Este pedido está {pedido.estadoPedido.toLowerCase()}: solo se puede consultar.
                </div>
            )}

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Productos</h5>

                            {pedido.items.length === 0 ? (
                                <p className="text-muted">Todavía no se cargaron productos.</p>
                            ) : (
                                <table className="table table-sm align-middle">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                            {editable && <th></th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedido.items.map((item) => (
                                            <tr key={item.idItemProducto}>
                                                <td>{item.producto?.nombre}</td>
                                                <td>
                                                    {editable && (
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm me-2"
                                                            disabled={item.cantidad <= 1}
                                                            onClick={() => ejecutar(
                                                                () => modificarCantidad(
                                                                    item.idItemProducto,
                                                                    item.cantidad - 1
                                                                ),
                                                                "Cantidad actualizada."
                                                            )}
                                                        >
                                                            −
                                                        </button>
                                                    )}
                                                    {item.cantidad}
                                                    {editable && (
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm ms-2"
                                                            onClick={() => ejecutar(
                                                                () => modificarCantidad(
                                                                    item.idItemProducto,
                                                                    item.cantidad + 1
                                                                ),
                                                                "Cantidad actualizada."
                                                            )}
                                                        >
                                                            +
                                                        </button>
                                                    )}
                                                </td>
                                                <td>{formatearPrecio(item.subTotal)}</td>
                                                {editable && (
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => ejecutar(
                                                                () => quitarItem(item.idItemProducto),
                                                                "Producto quitado."
                                                            )}
                                                        >
                                                            Quitar
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {editable && (
                                <div className="row g-2 mb-3">
                                    <div className="col-7">
                                        <select
                                            className="form-select"
                                            value={productoId}
                                            onChange={(e) => setProductoId(e.target.value)}
                                        >
                                            <option value="">Seleccione un producto</option>
                                            {productos.map((producto) => (
                                                <option
                                                    key={producto.idProducto}
                                                    value={producto.idProducto}
                                                    disabled={!productoDisponibleAhora(producto)}
                                                >
                                                    {producto.nombre} · {producto.tipoProducto} · {formatearPrecio(producto.precio)}
                                                    {!productoDisponibleAhora(producto) ? " (fuera de horario)" : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-2">
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            value={cantidad}
                                            onChange={(e) => setCantidad(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-3">
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={agregarProducto}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <hr />
                            <p className="mb-1">
                                Subtotal (sin descuento): {formatearPrecio(subtotal)}
                            </p>
                            <p className="mb-1">
                                Descuento del cliente ({pedido.pago?.tipoDescuento ?? pedido.cliente?.tipo} · {descuento}%):{" "}
                                -{formatearPrecio(subtotal - total)}
                            </p>
                            <p className="fw-bold fs-5 mb-0">
                                Total (con descuento): {formatearPrecio(total)}
                            </p>
                        </div>
                    </div>

                    {editable && !pedido.pago && (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Pagar pedido</h5>

                                <div className="row g-2">
                                    <div className="col-md-6">
                                        <select
                                            className="form-select"
                                            value={metodoPago}
                                            onChange={(e) => {
                                                setMetodoPago(e.target.value);
                                                setMostrarQR(false);
                                                setError("");
                                                setMensaje("");
                                            }}
                                        >
                                            <option value="">Método de pago</option>
                                            {METODOS_PAGO.map((metodo) => (
                                                <option key={metodo} value={metodo}>
                                                    {metodo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-success w-100"
                                            disabled={pedido.items.length === 0}
                                            onClick={pagar}
                                        >
                                            {metodoPago === "MercadoPago"
                                                ? "Continuar al QR"
                                                : `Pagar ${formatearPrecio(total)}`}
                                        </button>
                                    </div>
                                </div>

                                {mostrarQR && metodoPago === "MercadoPago" && (
                                    <div className="mt-4">
                                        <hr />
                                        <MercadoPago
                                            pedidoId={Number(id)}
                                            token={token}
                                            onPagoConfirmado={async () => {
                                                await recargar();
                                                setMostrarQR(false);
                                                setMensaje("¡Pago confirmado correctamente!");
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {pedido.pago && (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Pago</h5>
                                <p className="mb-1">
                                    Método: {pedido.pago.metodoPago}
                                </p>
                                <p className="mb-0">
                                    Fecha: {new Date(pedido.pago.fechaHora).toLocaleString("es-AR")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <p className="mb-1">
                                <strong>Mesa:</strong> {pedido.mesa?.idMesa}
                            </p>
                            <p className="mb-1">
                                <strong>Cliente:</strong> #{pedido.cliente?.id} · {pedido.cliente?.tipo}
                            </p>
                            <p className="mb-3">
                                <strong>Sucursal:</strong> {pedido.sucursal?.direccion}
                            </p>

                            {editable ? (
                                <>
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select mb-2"
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                    >
                                        {ESTADOS_EDITABLES.map((e) => (
                                            <option key={e} value={e}>
                                                {e}
                                            </option>
                                        ))}
                                    </select>

                                    <label className="form-label">Comensales</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={pedido.mesa?.maxComensales}
                                        className="form-control mb-3"
                                        value={comensales}
                                        onChange={(e) => setComensales(e.target.value)}
                                    />

                                    <button
                                        className="btn btn-success w-100"
                                        onClick={guardar}
                                    >
                                        Guardar cambios
                                    </button>
                                </>
                            ) : (
                                <p className="mb-0">
                                    <strong>Comensales:</strong> {pedido.comensales}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PedidoDetalle;