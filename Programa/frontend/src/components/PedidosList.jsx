import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerPedidos, eliminarPedido } from "../services/pedidoService";
import { COLORES_ESTADO_PEDIDO, calcularTotalConDescuento, formatearPrecio } from "../models/Pedido";

function PedidosList() {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            setPedidos(await obtenerPedidos());
            setError("");
        } catch (error) {
            setError("No se pudieron cargar los pedidos.");
        }
    };

    const borrarPedido = async (id) => {
        const confirmar = window.confirm(`¿Está seguro de que desea eliminar el pedido ${id}?`);

        if (!confirmar) {
            return;
        }

        try {
            await eliminarPedido(id);
            setPedidos(pedidos.filter((pedido) => pedido.idPedido !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2 className="mb-3">Pedidos</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {pedidos.length === 0 && !error ? (
                <p>No hay pedidos registrados.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Mesa</th>
                                <th>Cliente</th>
                                <th>Comensales</th>
                                <th>Estado</th>
                                <th>Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.map((pedido) => (
                                <tr key={pedido.idPedido}>
                                    <td>{pedido.idPedido}</td>
                                    <td>{pedido.mesa?.idMesa}</td>
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
                                    <td>
                                        <Link
                                            to={`/pedidos/${pedido.idPedido}`}
                                            className="btn btn-primary btn-sm me-2"
                                        >
                                            Ver
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => borrarPedido(pedido.idPedido)}
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

export default PedidosList;