import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { iniciarSesion as autenticarUsuario } from "../services/authService";

function LoginPage() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const { iniciarSesion } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
            const datos = await autenticarUsuario(
                nombreUsuario.trim(),
                contrasenia
            );

            iniciarSesion(datos);
            navigate("/", { replace: true });
        } catch (error) {
            setError(error.message || "No se pudo iniciar sesión.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-sm p-4" style={{ width: "100%", maxWidth: "420px" }}>
                <div className="card-body">
                    <h1 className="h3 text-center mb-2">La Pastelería</h1>
                    <p className="text-muted text-center mb-4">
                        Ingresá a tu cuenta
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombreUsuario" className="form-label">
                                Usuario
                            </label>
                            <input
                                id="nombreUsuario"
                                type="text"
                                className="form-control"
                                value={nombreUsuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                                autoComplete="username"
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="contrasenia" className="form-label">
                                Contraseña
                            </label>
                            <input
                                id="contrasenia"
                                type="password"
                                className="form-control"
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                autoComplete="current-password"
                                required
                                disabled={cargando}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-dark w-100"
                            disabled={cargando}
                        >
                            {cargando ? "Ingresando..." : "Iniciar sesión"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;