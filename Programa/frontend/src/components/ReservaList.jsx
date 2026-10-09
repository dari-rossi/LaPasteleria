import { useEffect, useState } from "react";
import {
    obtenerReservas,
    eliminarReserva
} from "../services/reservaService";
import ReservaForm from "./ReservaForm";

const formatearFecha = (iso) => {
    return new Date(iso).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short"
    });
};

// La identidad de una reserva es la mesa + la fecha y hora
const mismaReserva = (a, b) => {
    return a.idMesa === b.idMesa && a.fechaHoraReservada === b.fechaHoraReservada;
};

function ReservaList() {
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState("");
    const [reservaEditar, setReservaEditar] = useState(null);

    useEffect(() => {
        cargarReservas();
    }, []);

    const cargarReservas = async () => {
        try {
            const datos = await obtenerReservas();
            setReservas(datos);
        } catch (error) {
            setError("No se pudieron cargar las reservas.");
        }
    };

    const agregarReserva = (nuevaReserva) => {
        setReservas([...reservas, nuevaReserva]);
    };

    const editarReserva = (reserva) => {
        setReservaEditar(reserva);
    };

    const actualizarReserva = (reservaModificada) => {
        setReservas(
            reservas.map((reserva) =>
                mismaReserva(reserva, reservaModificada)
                    ? reservaModificada
                    : reserva
            )
        );

        setReservaEditar(null);
    };

    const borrarReserva = async (reservaABorrar) => {
        const confirmar = window.confirm(
            "¿Está seguro de que desea eliminar esta reserva?"
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarReserva(
                reservaABorrar.idMesa,
                reservaABorrar.fechaHoraReservada
            );

            setReservas(
                reservas.filter((reserva) => !mismaReserva(reserva, reservaABorrar))
            );
        } catch (error) {
            setError("No se pudo eliminar la reserva.");
        }
    };

    const cancelarEdicion = () => {
        setReservaEditar(null);
    };

    return (
        <div>
            <h2 className="mb-3">Reservas</h2>

            <ReservaForm
                reservaEditar={reservaEditar}
                onReservaCreada={agregarReserva}
                onReservaModificada={actualizarReserva}
                onCancelarEdicion={cancelarEdicion}
            />

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {reservas.length === 0 && !error ? (
                <p>No hay reservas registradas.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Mesa</th>
                                <th>Fecha y hora</th>
                                <th>Comensales</th>
                                <th>Estado</th>
                                <th>DNI</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={`${reserva.idMesa}-${reserva.fechaHoraReservada}`}>
                                    <td>{reserva.idMesa}</td>
                                    <td>{formatearFecha(reserva.fechaHoraReservada)}</td>
                                    <td>{reserva.cantComensales}</td>
                                    <td>{reserva.estadoReserva}</td>
                                    <td>{reserva.dni}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() =>
                                                editarReserva(reserva)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                borrarReserva(reserva)
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

export default ReservaList;