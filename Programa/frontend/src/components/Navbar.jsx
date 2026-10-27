import { NavLink } from "react-router-dom";

const SECCIONES = [
    { to: "/productos", label: "Productos" },
    { to: "/inventario", label: "Inventario" }
];

function Navbar() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3 mb-4">
            <span className="navbar-brand">La Pastelería</span>

            <div className="navbar-nav">
                {SECCIONES.map((seccion) => (
                    <NavLink key={seccion.to} className="nav-link" to={seccion.to}>
                        {seccion.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default Navbar;