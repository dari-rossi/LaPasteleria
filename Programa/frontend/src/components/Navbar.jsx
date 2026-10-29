import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSucursal } from "../context/SucursalContext";

// Secciones propias de cada sucursal
const SECCIONES_SUCURSAL = [
    { to: "/sucursal", label: "Sucursal" },
    { to: "/pedidos", label: "Pedidos" },
    { to: "/mesas", label: "Mesas" },
<<<<<<< HEAD
    { to: "/inventario", label: "Inventario" },
    { to: "/empleados", label: "Empleados" },
    { to: "/reservas", label: "Reservas" },
    { to: "/gastos", label: "Gastos" },
    { to: "/planilla", label: "Planilla" },
=======
    { to: "/pedidos", label: "Pedidos" },
    { to: "/reservas", label: "Reservas" }
>>>>>>> mercado-pago
];

function Navbar() {
    const { sucursalId, puedeElegir, cambiarSucursal } = useSucursal();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // Volver al menú general también deja de trabajar en la sucursal actual
    const irAlMenuGeneral = () => {
        cambiarSucursal();
        navigate("/");
    };

    // En el menú general mismo el botón sobra
    const mostrarMenuGeneral = puedeElegir && (sucursalId || pathname !== "/");

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3 mb-4">
            <span className="navbar-brand">La Pastelería</span>

            {/* Las secciones aparecen solo cuando se está dentro de una sucursal */}
            {sucursalId && (
                <div className="navbar-nav flex-wrap">
                    {SECCIONES_SUCURSAL.map((seccion) => (
                        <NavLink key={seccion.to} className="nav-link" to={seccion.to}>
                            {seccion.label}
                        </NavLink>
                    ))}
                </div>
            )}

            {mostrarMenuGeneral && (
                <button
                    className="btn btn-outline-light btn-sm ms-auto"
                    onClick={irAlMenuGeneral}
                >
                    Menú general
                </button>
            )}
        </nav>
    );
}

export default Navbar;