import { useEffect, useState } from "react";
import {
    crearUsuario,
    modificarUsuario
} from "../services/usuarioService";

function UsuarioForm({
    sucursal,
    tipo,
    usuarioEditar,
    onUsuarioGuardado,
    onCancelar
}) {
    const [formulario, setFormulario] = useState({
        nombreUsuario: "",
        contrasenia: ""
    });

    const [error, setError] = useState("");

    const esEdicion = Boolean(usuarioEditar);

    useEffect(() => {
        if (usuarioEditar) {
            setFormulario({
                nombreUsuario: usuarioEditar.nombreUsuario,
                contrasenia: ""
            });
        } else {
            setFormulario({
                nombreUsuario: "",
                contrasenia: ""
            });
        }

        setError("");
    }, [usuarioEditar, sucursal, tipo]);

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        setError("");

        const datos = {
            nombreUsuario: formulario.nombreUsuario.trim()
        };

        if (formulario.contrasenia) {
            datos.contrasenia = formulario.contrasenia;
        }

        try {
            if (esEdicion) {
                datos.idTipoEmpleado = usuarioEditar.idTipoEmpleado;
                datos.sucursalId = usuarioEditar.sucursalId;

                await modificarUsuario(usuarioEditar.idUsuario, datos);
            } else {
                if (!formulario.contrasenia) {
                    setError("La contraseña es obligatoria.");
                    return;
                }

                datos.idTipoEmpleado = tipo.idTipoEmpleado;
                datos.sucursalId = sucursal.id;

                await crearUsuario(datos);
            }

            onUsuarioGuardado();
        } catch (error) {
            setError(error.message || "No se pudo guardar el usuario.");
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h3 className="card-title">
                    {esEdicion ? "Editar usuario" : "Nueva cuenta de usuario"}
                </h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {esEdicion ? (
                    <div className="mb-3">
                        <p className="mb-1">
                            <strong>Puesto:</strong>{" "}
                            {usuarioEditar.tipoEmpleado?.rol}
                        </p>

                        <p className="mb-0">
                            <strong>Sucursal:</strong>{" "}
                            {usuarioEditar.sucursal?.direccion ?? "Sin sucursal"}
                        </p>
                    </div>
                ) : (
                    <div className="mb-3">
                        <p className="mb-1">
                            <strong>Puesto:</strong> {tipo?.rol}
                        </p>

                        <p className="mb-0">
                            <strong>Sucursal:</strong> {sucursal?.direccion}
                        </p>
                    </div>
                )}

                <form onSubmit={manejarEnvio}>
                    <div className="mb-3">
                        <label className="form-label">Nombre de usuario</label>

                        <input
                            type="text"
                            name="nombreUsuario"
                            className="form-control"
                            value={formulario.nombreUsuario}
                            onChange={manejarCambio}
                            minLength="3"
                            maxLength="30"
                            pattern="[a-zA-Z0-9._\-]+"
                            title="Usá entre 3 y 30 caracteres: letras, números, punto, guion o guion bajo."
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            {esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                        </label>

                        <input
                            type="password"
                            name="contrasenia"
                            className="form-control"
                            value={formulario.contrasenia}
                            onChange={manejarCambio}
                            minLength="8"
                            autoComplete="new-password"
                            required={!esEdicion}
                        />

                        <div className="form-text">
                            {esEdicion
                                ? "Dejar vacía si no quiere cambiar la contraseña."
                                : "Debe tener al menos 8 caracteres."}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary me-2">
                        {esEdicion ? "Guardar cambios" : "Crear usuario"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancelar}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UsuarioForm;