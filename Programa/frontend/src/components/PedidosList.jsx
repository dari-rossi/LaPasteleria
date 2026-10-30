import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerPedidos, eliminarPedido } from "../services/pedidoService";
import {
    COLORES_ESTADO_PEDIDO,
    calcularTotalConDescuento,
    formatearPrecio
} from "../models/Pedido";
import { useAuth } from "../context/AuthContext";

function PedidosList({ sucursalId }) {
    const navigate = useNavigate();
    const { sesion } = useAuth();
    const puedeEliminar = sesion?.rol === "MOZO";

    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState("");
    const [seleccionado, setSeleccionado] = useState(null);

    useEffect(() => {
        cargarPedidos();
    }, [sucursalId]);

    const cargarPedidos = async () => {
        try {
            setPedidos(await obtenerPedidos({ sucursalId }));
            setSeleccionado(null);
            setError("");
        } catch (error) {
            setError("No se pudieron cargar los pedidos.");
        }
    };

    const borrarPedido = async () => {
        if (!puedeEliminar || !seleccionado) {
            return;
        }

        const confirmar = window.confirm(
            `¿Está seguro de que desea eliminar el pedido ${seleccionado}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarPedido(seleccionado);

            setPedidos((actuales) =>
                actuales.filter((pedido) => pedido.idPedido !== seleccionado)
            );

            setSeleccionado(null);
            setError("");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2 className="mb-3">Pedidos</h2>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <button
                    className="btn btn-primary me-2"
                    disabled={!seleccionado}
                    onClick={() => navigate(`/pedidos/${seleccionado}`)}
                >
                    Ver
                </button>

                {puedeEliminar && (
                    <button
                        className="btn btn-outline-danger"
                        disabled={!seleccionado}
                        onClick={borrarPedido}
                    >
                        Eliminar
                    </button>
                )}
            </div>

            {pedidos.length === 0 && !error ? (
                <p>No hay pedidos registrados.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Mesa</th>
                                <th>Cliente</th>
                                <th>Comensales</th>
                                <th>Estado</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.map((pedido) => (
                                <tr
                                    key={pedido.idPedido}
                                    onClick={() => setSeleccionado(pedido.idPedido)}
                                    onDoubleClick={() => navigate(`/pedidos/${pedido.idPedido}`)}
                                    className={seleccionado === pedido.idPedido ? "table-active" : ""}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{pedido.idPedido}</td>
                                    <td>{pedido.mesa?.numero}</td>
                                    <td>
                                        #{pedido.cliente?.id} · {pedido.cliente?.tipo}
                                    </td>
                                    <td>{pedido.comensales}</td>
                                    <td>
                                        <span className={`badge ${COLORES_ESTADO_PEDIDO[pedido.estadoPedido]}`}>
                                            {pedido.estadoPedido}
                                        </span>
                                    </td>
                                    <td>
                                        {formatearPrecio(
                                            pedido.pago?.precioFinal ?? calcularTotalConDescuento(pedido)
                                        )}
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

export default PedidosList;