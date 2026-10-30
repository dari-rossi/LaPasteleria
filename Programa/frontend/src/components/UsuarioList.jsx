import { useState } from "react";
import { eliminarUsuario } from "../services/usuarioService";
import UsuarioForm from "./UsuarioForm";

const PUESTOS = [
    { rol: "GERENTE", nombre: "Gerente" },
    { rol: "MOZO", nombre: "Mozo" },
    { rol: "AYUDANTE_COCINA", nombre: "Ayudante de cocina" }
];

function UsuarioList({ usuarios, sucursales, tipos, onActualizar }) {
    const [abierta, setAbierta] = useState(null);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [puestoCrear, setPuestoCrear] = useState(null);
    const [sucursalCrear, setSucursalCrear] = useState(null);
    const [error, setError] = useState("");

    const cuentaDuenio = usuarios.find(
        (usuario) => usuario.sucursalId === null
    );

    const alternar = (id) => {
        setAbierta((actual) => actual === id ? null : id);
        setUsuarioEditar(null);
        setPuestoCrear(null);
        setError("");
    };

    const buscarUsuario = (sucursalId, rol) => {
        return usuarios.find(
            (usuario) =>
                Number(usuario.sucursalId) === Number(sucursalId) &&
                usuario.tipoEmpleado?.rol === rol
        );
    };

    const buscarTipo = (rol) => {
        return tipos.find((tipo) => tipo.rol === rol);
    };

    const crear = (sucursal, rol) => {
        const tipo = buscarTipo(rol);

        if (!tipo) {
            setError("No se encontró el tipo de empleado.");
            return;
        }

        setSucursalCrear(sucursal);
        setPuestoCrear(tipo);
        setUsuarioEditar(null);
        setError("");
    };

    const editar = (usuario) => {
        setUsuarioEditar(usuario);
        setSucursalCrear(null);
        setPuestoCrear(null);
        setError("");
    };

    const cancelar = () => {
        setUsuarioEditar(null);
        setSucursalCrear(null);
        setPuestoCrear(null);
        setError("");
    };

    const guardar = async () => {
        cancelar();
        await onActualizar();
    };

    const borrar = async (usuario) => {
        const confirmar = window.confirm(
            `¿Está seguro de que desea eliminar la cuenta "${usuario.nombreUsuario}"?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarUsuario(usuario.idUsuario);
            setError("");
            await onActualizar();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {usuarioEditar && (
                <UsuarioForm
                    usuarioEditar={usuarioEditar}
                    onUsuarioGuardado={guardar}
                    onCancelar={cancelar}
                />
            )}

            {sucursalCrear && puestoCrear && (
                <UsuarioForm
                    sucursal={sucursalCrear}
                    tipo={puestoCrear}
                    onUsuarioGuardado={guardar}
                    onCancelar={cancelar}
                />
            )}

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Cuenta del dueño</h5>

                    {cuentaDuenio ? (
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div>
                                <strong>{cuentaDuenio.nombreUsuario}</strong>
                                <div className="text-muted small">DUENIO · Sin sucursal</div>
                            </div>

                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => editar(cuentaDuenio)}
                            >
                                Editar
                            </button>
                        </div>
                    ) : (
                        <p className="text-muted mb-0">
                            No se encontró una cuenta de dueño.
                        </p>
                    )}
                </div>
            </div>

            <h4 className="mb-3">Cuentas por sucursal</h4>

            {sucursales.length === 0 ? (
                <p>No hay sucursales registradas.</p>
            ) : (
                <div className="list-group">
                    {sucursales.map((sucursal) => {
                        const estaAbierta = abierta === sucursal.id;

                        return (
                            <div
                                key={sucursal.id}
                                className="list-group-item p-0"
                            >
                                <button
                                    type="button"
                                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3"
                                    onClick={() => alternar(sucursal.id)}
                                    aria-expanded={estaAbierta}
                                >
                                    <span className="fw-semibold">
                                        {sucursal.direccion}
                                    </span>

                                    <span className="text-muted">
                                        {estaAbierta ? "▲" : "▼"}
                                    </span>
                                </button>

                                {estaAbierta && (
                                    <div className="px-3 pb-3">
                                        {PUESTOS.map((puesto) => {
                                            const usuario = buscarUsuario(
                                                sucursal.id,
                                                puesto.rol
                                            );

                                            return (
                                                <div
                                                    key={puesto.rol}
                                                    className="border rounded p-3 mb-2"
                                                >
                                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                                        <div>
                                                            <strong>{puesto.nombre}</strong>

                                                            {usuario ? (
                                                                <div className="text-muted small">
                                                                    Usuario: {usuario.nombreUsuario}
                                                                </div>
                                                            ) : (
                                                                <div className="text-warning small">
                                                                    Cuenta pendiente
                                                                </div>
                                                            )}
                                                        </div>

                                                        {usuario ? (
                                                            <div>
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm me-2"
                                                                    onClick={() => editar(usuario)}
                                                                >
                                                                    Editar
                                                                </button>

                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => borrar(usuario)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => crear(sucursal, puesto.rol)}
                                                            >
                                                                Crear usuario
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default UsuarioList;