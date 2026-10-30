import { useEffect, useState } from "react";
import { obtenerSucursalPorId, modificarSucursal } from "../services/sucursalService";
import { useSucursal } from "../context/SucursalContext";
import { useAuth } from "../context/AuthContext";
import PlanillasSucursal from "./PlanillasSucursal";

function Campo({ id, etiqueta, name, valor, onChange, columnas, bloqueado }) {
    return (
        <div className={`col-6 ${columnas}`}>
            <label htmlFor={bloqueado ? undefined : id} className="form-label">{etiqueta}</label>
            <input
                id={id}
                name={name}
                type="text"
                readOnly={bloqueado}
                tabIndex={bloqueado ? -1 : undefined}
                className={`form-control text-center ${bloqueado ? "bg-white pe-none user-select-none" : ""}`}
                value={valor}
                onChange={onChange}
            />
        </div>
    );
}

const desdeSucursal = (sucursal) => ({
    telefono: sucursal.telefono,
    direccion: sucursal.direccion,
    codigoPostal: sucursal.codigoPostal,
    horarios: sucursal.horarios
});

// Datos de la sucursal en la que se está trabajando; se editan al apretar "Editar"
function SucursalDetalle() {
    const { sucursalId } = useSucursal();
    const { sesion } = useAuth();
    // Solo el dueño modifica los datos de la sucursal; el gerente solo los ve
    const puedeEditar = sesion?.rol === "DUENIO";
    const [sucursal, setSucursal] = useState(null);
    const [formulario, setFormulario] = useState(null);
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                const datos = await obtenerSucursalPorId(sucursalId);

                setSucursal(datos);
                setFormulario(desdeSucursal(datos));
                setEditando(false);
                setError("");
            } catch (error) {
                setError("No se pudo cargar la sucursal.");
            }
        };

        cargar();
    }, [sucursalId]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const empezarEdicion = () => {
        setError("");
        setMensaje("");
        setEditando(true);
    };

    const cancelarEdicion = () => {
        setFormulario(desdeSucursal(sucursal));
        setError("");
        setEditando(false);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!editando) {
            return;
        }

        setError("");
        setMensaje("");

        try {
            const actualizada = await modificarSucursal(sucursalId, formulario);

            setSucursal(actualizada);
            setFormulario(desdeSucursal(actualizada));
            setEditando(false);
            setMensaje("Sucursal actualizada.");
        } catch (error) {
            setError(error.message);
        }
    };

    if (error && !sucursal) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!sucursal || !formulario) {
        return <p>Cargando sucursal...</p>;
    }

    const bloqueado = !editando;

    return (
        <div>
            <h2 className="mb-4">Datos de Sucursal</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {mensaje && <div className="alert alert-success">{mensaje}</div>}

            <form onSubmit={manejarEnvio}>
                <div className="row g-3">
                    <div className="col-6 col-md-2">
                        <label htmlFor="sucursal-id" className="form-label">ID</label>
                        <input
                            id="sucursal-id"
                            type="text"
                            disabled
                            className="form-control text-center"
                            value={String(sucursal.id).padStart(4, "0")}
                        />
                    </div>

                    <Campo id="sucursal-telefono" etiqueta="Teléfono" name="telefono" columnas="col-md-2"
                           valor={formulario.telefono} onChange={manejarCambio} bloqueado={bloqueado} />
                    <Campo id="sucursal-direccion" etiqueta="Dirección" name="direccion" columnas="col-md-3"
                           valor={formulario.direccion} onChange={manejarCambio} bloqueado={bloqueado} />
                    <Campo id="sucursal-codigo-postal" etiqueta="Cód. Postal" name="codigoPostal" columnas="col-md-2"
                           valor={formulario.codigoPostal} onChange={manejarCambio} bloqueado={bloqueado} />
                    <Campo id="sucursal-horarios" etiqueta="Horario" name="horarios" columnas="col-md-3"
                           valor={formulario.horarios} onChange={manejarCambio} bloqueado={bloqueado} />
                </div>

                <div className="mt-3">
                    {editando ? (
                        <>
                            <button key="guardar" type="submit" className="btn btn-success me-2">
                                Guardar cambios
                            </button>
                            <button key="cancelar" type="button" className="btn btn-outline-secondary" onClick={cancelarEdicion}>
                                Cancelar
                            </button>
                        </>
                    ) : (
                        puedeEditar && (
                            <button key="editar" type="button" className="btn btn-primary" onClick={empezarEdicion}>
                                Editar
                            </button>
                        )
                    )}
                </div>
            </form>
            {/* Las planillas las ve solo el gerente, debajo de los datos de la sucursal */}
            {sesion?.rol === "GERENTE" && <PlanillasSucursal />}
        </div>
    );
}

export default SucursalDetalle;