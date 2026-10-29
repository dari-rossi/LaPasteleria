import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerSucursales, eliminarSucursal } from "../services/sucursalService";
import { useSucursal } from "../context/SucursalContext";
import SucursalForm from "./SucursalForm";

function SucursalList() {
    const navigate = useNavigate();
    const { sucursalId, cambiarSucursal } = useSucursal();
    const [sucursales, setSucursales] = useState([]);
    const [error, setError] = useState("");
    const [abierta, setAbierta] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                setSucursales(await obtenerSucursales());
                setError("");
            } catch (error) {
                setError("No se pudieron cargar las sucursales.");
            }
        };

        cargar();
    }, []);

    const alternar = (id) => {
        setAbierta((actual) => (actual === id ? null : id));
    };

    const entrar = (id) => {
        cambiarSucursal(id);
        navigate("/sucursal");
    };

    const agregarSucursal = (nuevaSucursal) => {
        setSucursales([...sucursales, nuevaSucursal]);
        setMostrarFormulario(false);
        setError("");
    };

    const borrar = async (sucursal) => {
        const confirmar = window.confirm(
            `¿Está seguro de que desea eliminar la sucursal ${sucursal.direccion}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarSucursal(sucursal.id);

            setSucursales(sucursales.filter((s) => s.id !== sucursal.id));
            setAbierta(null);
            setError("");

            // Si era la sucursal en la que se estaba trabajando, se deja de trabajar en ella
            if (sucursal.id === sucursalId) {
                cambiarSucursal();
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Sucursales</h2>
                {!mostrarFormulario && (
                    <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
                        Agregar sucursal
                    </button>
                )}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {mostrarFormulario && (
                <>
                    <SucursalForm
                        onSucursalCreada={agregarSucursal}
                        onCancelarEdicion={() => setMostrarFormulario(false)}
                    />

                    <button
                        className="btn btn-link mb-3 p-0"
                        onClick={() => setMostrarFormulario(false)}
                    >
                        Cerrar formulario
                    </button>
                </>
            )}

            {sucursales.length === 0 && !error ? (
                <p>No hay sucursales registradas.</p>
            ) : (
                <div className="list-group">
                    {sucursales.map((sucursal) => {
                        const estaAbierta = abierta === sucursal.id;

                        return (
                            <div key={sucursal.id} className="list-group-item p-0">
                                <button
                                    type="button"
                                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3"
                                    onClick={() => alternar(sucursal.id)}
                                    aria-expanded={estaAbierta}
                                >
                                    <span className="fw-semibold">{sucursal.direccion}</span>
                                    <span className="text-muted">{estaAbierta ? "▲" : "▼"}</span>
                                </button>

                                {estaAbierta && (
                                    <div className="px-3 pb-3">
                                        <p className="mb-1"><strong>Teléfono:</strong> {sucursal.telefono}</p>
                                        <p className="mb-1"><strong>Código postal:</strong> {sucursal.codigoPostal}</p>
                                        <p className="mb-3"><strong>Horarios:</strong> {sucursal.horarios}</p>

                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => entrar(sucursal.id)}
                                        >
                                            Entrar a la sucursal
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => borrar(sucursal)}
                                        >
                                            Eliminar
                                        </button>
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

export default SucursalList;