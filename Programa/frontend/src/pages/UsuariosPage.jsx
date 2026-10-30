import { useEffect, useState } from "react";
import { obtenerUsuarios } from "../services/usuarioService";
import { obtenerSucursales } from "../services/sucursalService";
import { obtenerTiposEmpleado } from "../services/tipoEmpleadoService";
import UsuarioList from "../components/UsuarioList";

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargarDatos = async () => {
        try {
            setError("");

            const [usuariosDatos, sucursalesDatos, tiposDatos] =
                await Promise.all([
                    obtenerUsuarios(),
                    obtenerSucursales(),
                    obtenerTiposEmpleado()
                ]);

            setUsuarios(usuariosDatos);
            setSucursales(sucursalesDatos);
            setTipos(tiposDatos);
        } catch (error) {
            setError(error.message || "No se pudieron cargar los usuarios.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    if (cargando) {
        return <p>Cargando usuarios...</p>;
    }

    return (
        <div>
            <h2 className="mb-3">Usuarios</h2>

            <p className="text-muted">
                Cada sucursal puede tener una cuenta por puesto.
            </p>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <UsuarioList
                usuarios={usuarios}
                sucursales={sucursales}
                tipos={tipos}
                onActualizar={cargarDatos}
            />
        </div>
    );
}

export default UsuariosPage;