import { useEffect, useState } from "react";
import {
    obtenerClientes,
    eliminarCliente
} from "../services/clienteService";
import ClienteForm from "./ClienteForm";

function ClienteList() {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState("");
    const [clienteEditar, setClienteEditar] = useState(null);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            const datos = await obtenerClientes();
            setClientes(datos);
        } catch (error) {
            setError("No se pudieron cargar los clientes.");
        }
    };

    const agregarCliente = (nuevoCliente) => {
        setClientes([...clientes, nuevoCliente]);
    };

    const editarCliente = (cliente) => {
        setClienteEditar(cliente);
    };

    const actualizarCliente = (clienteModificado) => {
        setClientes(
            clientes.map((cliente) =>
                cliente.id === clienteModificado.id
                    ? clienteModificado
                    : cliente
            )
        );

        setClienteEditar(null);
    };

    const borrarCliente = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar este cliente?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarCliente(id);

            setClientes(
                clientes.filter((cliente) => cliente.id !== id)
            );
        } catch (error) {
            setError("No se pudo eliminar el cliente.");
        }
    };

    const cancelarEdicion = () => {
        setClienteEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Clientes</h2>

            <ClienteForm
                clienteEditar={clienteEditar}
                onClienteCreado={agregarCliente}
                onClienteModificado={actualizarCliente}
                onCancelarEdicion={cancelarEdicion}
            />

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {clientes.length === 0 && !error ? (
                <p>No hay clientes registrados.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Descuento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.id}</td>
                                    <td>{cliente.tipo}</td>
                                    <td>{cliente.descuento ?? 0}%</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                editarCliente(cliente)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                borrarCliente(cliente.id)
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

export default ClienteList;