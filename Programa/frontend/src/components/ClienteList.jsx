import { useEffect, useState } from "react";
import {
    obtenerClientes,
    eliminarCliente
} from "../services/clienteService";
import ClienteForm from "./ClienteForm";
import { useAuth } from "../context/AuthContext";

function ClienteList() {
    const { sesion } = useAuth();
    const esDuenio = sesion?.rol === "DUENIO";

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
            setError("");
        } catch (error) {
            setError("No se pudieron cargar las categorías de clientes.");
        }
    };

    const agregarCliente = (nuevoCliente) => {
        setClientes((anteriores) => [...anteriores, nuevoCliente]);
    };

    const editarCliente = (cliente) => {
        if (!esDuenio) return;
        setClienteEditar(cliente);
    };

    const actualizarCliente = (clienteModificado) => {
        setClientes((anteriores) =>
            anteriores.map((cliente) =>
                cliente.id === clienteModificado.id
                    ? clienteModificado
                    : cliente
            )
        );

        setClienteEditar(null);
    };

    const borrarCliente = async (id) => {
        if (!esDuenio) return;

        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar esta categoría?"
        );

        if (!confirmar) return;

        setError("");

        try {
            await eliminarCliente(id);

            setClientes((anteriores) =>
                anteriores.filter((cliente) => cliente.id !== id)
            );

            if (clienteEditar?.id === id) {
                setClienteEditar(null);
            }
        } catch (error) {
            setError(error.message || "No se pudo eliminar la categoría.");
        }
    };

    const cancelarEdicion = () => {
        setClienteEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Categorías de clientes</h2>

            {esDuenio && (
                <ClienteForm
                    clienteEditar={clienteEditar}
                    onClienteCreado={agregarCliente}
                    onClienteModificado={actualizarCliente}
                    onCancelarEdicion={cancelarEdicion}
                />
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {clientes.length === 0 && !error ? (
                <p>No hay categorías registradas.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo de cliente</th>
                                <th>Descuento</th>
                                {esDuenio && <th>Acciones</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {clientes.map((cliente) => (
                                <tr
                                    key={cliente.id}
                                    onClick={() => {
                                        if (esDuenio) {
                                            editarCliente(cliente);
                                        }
                                    }}
                                    style={{
                                        cursor: esDuenio ? "pointer" : "default"
                                    }}
                                >
                                    <td>{cliente.id}</td>
                                    <td>{cliente.tipo}</td>
                                    <td>{cliente.descuento}%</td>

                                    {esDuenio && (
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => editarCliente(cliente)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => borrarCliente(cliente.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    )}
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