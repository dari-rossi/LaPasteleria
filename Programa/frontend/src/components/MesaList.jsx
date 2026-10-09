import { useEffect, useState } from "react";
import { obtenerMesas, eliminarMesa } from "../services/mesaService";
import MesaForm from "./MesaForm";

const COLORES_ESTADO = {
    Libre: "bg-success",
    Ocupada: "bg-danger",
    Reservada: "bg-warning text-dark"
};

function MesaList() {
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState("");
    const [mesaEditar, setMesaEditar] = useState(null);

    useEffect(() => {
        cargarMesas();
    }, []);

    const cargarMesas = async () => {
        try {
            const datos = await obtenerMesas();
            setMesas(datos);
        } catch (error) {
            setError("No se pudieron cargar las mesas.");
        }
    };

    const agregarMesa = (nuevaMesa) => {
        setMesas([...mesas, nuevaMesa]);
    };

    const editarMesa = (mesa) => {
        setMesaEditar(mesa);
    };

    const actualizarMesa = (mesaModificada) => {
        setMesas(
            mesas.map((mesa) =>
                mesa.idMesa === mesaModificada.idMesa
                    ? mesaModificada
                    : mesa
            )
        );

        setMesaEditar(null);
    };

    const borrarMesa = async (id) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar esta mesa?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarMesa(id);

            setMesas(
                mesas.filter((mesa) => mesa.idMesa !== id)
            );
        } catch (error) {
            setError("No se pudo eliminar la mesa.");
        }
    };

    const cancelarEdicion = () => {
        setMesaEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Mesas</h2>

            <MesaForm
                mesaEditar={mesaEditar}
                onMesaCreada={agregarMesa}
                onMesaModificada={actualizarMesa}
                onCancelarEdicion={cancelarEdicion}
            />

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {mesas.length === 0 && !error ? (
                <p>No hay mesas registradas.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Estado</th>
                                <th>Máximo de comensales</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {mesas.map((mesa) => (
                                <tr key={mesa.idMesa}>
                                    <td>{mesa.idMesa}</td>
                                    <td>
                                        <span className={`badge ${COLORES_ESTADO[mesa.estado]}`}>
                                            {mesa.estado}
                                        </span>
                                    </td>
                                    <td>{mesa.maxComensales}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                editarMesa(mesa)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                borrarMesa(mesa.idMesa)
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

export default MesaList;