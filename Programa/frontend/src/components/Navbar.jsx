import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSucursal } from "../context/SucursalContext";
import { useAuth } from "../context/AuthContext";

const SECCIONES_POR_ROL = {
    DUENIO: [
        { to: "/sucursal", label: "Sucursal" },
        { to: "/mesas", label: "Mesas" },
        { to: "/pedidos", label: "Pedidos" },
        { to: "/inventario", label: "Inventario" },
        { to: "/gastos", label: "Gastos" },
        { to: "/productos", label: "Productos" }
    ],
    GERENTE: [
        { to: "/sucursal", label: "Sucursal" },
        { to: "/mesas", label: "Mesas" },
        { to: "/pedidos", label: "Pedidos" },
        { to: "/inventario", label: "Inventario" },
        { to: "/gastos", label: "Gastos" },
        { to: "/productos", label: "Productos" },
        { to: "/tipos-empleado", label: "Tipos de empleado" }
    ],
    MOZO: [
        { to: "/mesas", label: "Mesas" },
        { to: "/pedidos", label: "Pedidos" },
        { to: "/reservas", label: "Reservas" },
        { to: "/productos", label: "Productos" }
    ],
    AYUDANTE_COCINA: [
        { to: "/inventario", label: "Inventario" },
        { to: "/productos", label: "Productos" }
    ]
};

function Navbar() {
    const { sucursalId, puedeElegir, cambiarSucursal } = useSucursal();
    const { sesion, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const rol = sesion?.rol;
    const secciones = SECCIONES_POR_ROL[rol] ?? [];

    const irAlMenuGeneral = () => {
        if (puedeElegir) {
            cambiarSucursal();
            navigate("/");
        }
    };

    const salir = () => {
        cerrarSesion();
        navigate("/login", { replace: true });
    };

    const mostrarMenuGeneral = puedeElegir &&
        (sucursalId !== null || pathname !== "/");

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3 mb-4">
            <NavLink className="navbar-brand" to="/">
                La Pastelería
            </NavLink>

            {sucursalId !== null && (
                <div className="navbar-nav flex-wrap">
                    {secciones.map((seccion) => (
                        <NavLink
                            key={seccion.to}
                            className="nav-link"
                            to={seccion.to}
                        >
                            {seccion.label}
                        </NavLink>
                    ))}
                </div>
            )}

            {mostrarMenuGeneral && (
                <button
                    className="btn btn-outline-light btn-sm ms-auto me-2"
                    onClick={irAlMenuGeneral}
                >
                    Menú general
                </button>
            )}

            <div className="d-flex align-items-center ms-auto">
                <span className="text-light small me-3">
                    {sesion?.nombreUsuario} ({rol})
                </span>

                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={salir}
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}

export default Navbar;