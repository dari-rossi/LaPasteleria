import { useEffect, useState } from "react";
import { crearTipoEmpleado, modificarTipoEmpleado } from "../services/tipoEmpleadoService";

const TIPOS_PERMITIDOS = ["Gerente", "Mozo", "Ayudante de cocina"];

const FORMULARIO_VACIO = {
    tipoEmpleado: "",
    sueldo: "",
    usuario: "",
    contrasenia: ""
};

function TipoEmpleadoForm({ tipoEditar, onTipoGuardado, onCancelarEdicion }) {
    const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
    const [error, setError] = useState("");

    useEffect(() => {
        if (tipoEditar) {
            setFormulario({
                tipoEmpleado: tipoEditar.tipoEmpleado,
                sueldo: String(tipoEditar.sueldo),
                usuario: tipoEditar.usuario ?? "",
                // La contraseña nunca viene del backend: vacía significa "no cambiarla"
                contrasenia: ""
            });
        }
    }, [tipoEditar]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        // El backend espera números, pero los inputs devuelven texto
        const datos = {
            tipoEmpleado: formulario.tipoEmpleado.trim(),
            sueldo: Number(formulario.sueldo)
        };

        // Usuario y contraseña son opcionales: si están vacíos, no se mandan
        if (formulario.usuario.trim()) {
            datos.usuario = formulario.usuario.trim();
        }

        if (formulario.contrasenia) {
            datos.contrasenia = formulario.contrasenia;
        }

        try {
            if (tipoEditar) {
                await modificarTipoEmpleado(tipoEditar.id, datos);
            } else {
                await crearTipoEmpleado(datos);
            }

            setFormulario(FORMULARIO_VACIO);
            onTipoGuardado();
        } catch (error) {
            setError(
                error.message ||
                (tipoEditar
                    ? "No se pudo modificar el tipo de empleado."
                    : "No se pudo crear el tipo de empleado.")
            );
        }
    };

    const cancelarEdicion = () => {
        setFormulario(FORMULARIO_VACIO);
        setError("");

        onCancelarEdicion();
    };

    // Al crear, usuario y contraseña van juntos o ninguno de los dos
    const usuarioCargado = formulario.usuario.trim() !== "";
    const contraseniaCargada = formulario.contrasenia !== "";

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {tipoEditar ? "Editar tipo de empleado" : "Nuevo tipo de empleado"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Puesto</label>
                        <select
                            name="tipoEmpleado"
                            className="form-select"
                            value={formulario.tipoEmpleado}
                            onChange={manejarCambio}
                            disabled={Boolean(tipoEditar)}
                            required
                        >
                            <option value="">Seleccioná un puesto</option>
                            {TIPOS_PERMITIDOS.map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Sueldo</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            name="sueldo"
                            className="form-control"
                            value={formulario.sueldo}
                            onChange={manejarCambio}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Usuario (opcional)</label>
                        <input
                            type="text"
                            name="usuario"
                            className="form-control"
                            value={formulario.usuario}
                            onChange={manejarCambio}
                            required={!tipoEditar && contraseniaCargada}
                            autoComplete="off"
                        />
                        <div className="form-text">
                            Solo los puestos que inician sesión lo necesitan. De 3 a 30 caracteres: letras, números, punto, guion o guion bajo.
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña (opcional)</label>
                        <input
                            type="password"
                            name="contrasenia"
                            className="form-control"
                            value={formulario.contrasenia}
                            onChange={manejarCambio}
                            required={!tipoEditar && usuarioCargado}
                            autoComplete="new-password"
                        />
                        <div className="form-text">
                            {tipoEditar
                                ? "Dejala vacía para no cambiarla."
                                : "Mínimo 8 caracteres."}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {tipoEditar ? "Guardar cambios" : "Crear tipo de empleado"}
                    </button>

                    {tipoEditar && (
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

export default TipoEmpleadoForm;
