import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { obtenerPedidoPorId, modificarPedido } from "../services/pedidoService";
import {
    ESTADOS_PEDIDO,
    COLORES_ESTADO_PEDIDO,
    calcularTotal,
    calcularTotalConDescuento,
    formatearPrecio
} from "../models/Pedido";

function PedidoDetalle() {
    const { id } = useParams();
    const [pedido, setPedido] = useState(null);
    const [estado, setEstado] = useState("");
    const [comensales, setComensales] = useState("");
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                const datos = await obtenerPedidoPorId(id);
                setPedido(datos);
                setEstado(datos.estadoPedido);
                setComensales(datos.comensales);
            } catch (error) {
                setError("No se pudo cargar el pedido.");
            }
        };

        cargar();
    }, [id]);

    const guardar = async () => {
        setError("");
        setMensaje("");

        try {
            const actualizado = await modificarPedido(id, {
                estadoPedido: estado,
                comensales: Number(comensales)
            });
            setPedido(actualizado);
            setMensaje("Pedido actualizado.");
        } catch (error) {
            setError(error.message);
        }
    };

    if (error && !pedido) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!pedido) {
        return <p>Cargando pedido...</p>;
    }

    const descuento = pedido.cliente?.descuento ?? 0;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                    Pedido #{pedido.idPedido}{" "}
                    <span className={`badge ${COLORES_ESTADO_PEDIDO[pedido.estadoPedido]}`}>
                        {pedido.estadoPedido}
                    </span>
                </h2>
                <Link to="/pedidos" className="btn btn-outline-secondary">Volver al listado</Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {mensaje && <div className="alert alert-success">{mensaje}</div>}

            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Productos</h5>

                            {pedido.items.length === 0 ? (
                                <p className="text-muted">Todavía no se cargaron productos.</p>
                            ) : (
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedido.items.map((item) => (
                                            <tr key={item.productoId}>
                                                <td>{item.producto?.nombre}</td>
                                                <td>{item.cantidad}</td>
                                                <td>{formatearPrecio(item.subTotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <p className="mb-1">Subtotal: {formatearPrecio(calcularTotal(pedido))}</p>
                            <p className="mb-1">Descuento del cliente: {descuento}%</p>
                            <p className="fw-bold mb-0">
                                Total: {formatearPrecio(pedido.pago?.precioFinal ?? calcularTotalConDescuento(pedido))}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <p className="mb-1"><strong>Mesa:</strong> {pedido.mesa?.idMesa}</p>
                            <p className="mb-1">
                                <strong>Cliente:</strong> #{pedido.cliente?.id} · {pedido.cliente?.tipo}
                            </p>
                            <p className="mb-3"><strong>Sucursal:</strong> {pedido.sucursal?.direccion}</p>

                            <label className="form-label">Estado</label>
                            <select
                                className="form-select mb-2"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                {ESTADOS_PEDIDO.map((e) => (
                                    <option key={e} value={e}>{e}</option>
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

                            <button className="btn btn-success w-100" onClick={guardar}>
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PedidoDetalle;