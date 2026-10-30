import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OPCIONES_POR_ROL = {
    DUENIO: [
        { to: "/sucursales", titulo: "Sucursales" },
        { to: "/productos", titulo: "Productos" },
        { to: "/tipos-empleado", titulo: "Tipos de empleado" },
        { to: "/informes", titulo: "Informes" },
        { to: "/sucursal", titulo: "Mi sucursal" },
        { to: "/mesas", titulo: "Mesas" },
        { to: "/pedidos", titulo: "Pedidos" },
        { to: "/inventario", titulo: "Inventario" },
        { to: "/gastos", titulo: "Gastos" },
        { to: "/usuarios", titulo: "Usuarios" }
    ],
    GERENTE: [
        { to: "/sucursal", titulo: "Mi sucursal" },
        { to: "/productos", titulo: "Productos" },
        { to: "/tipos-empleado", titulo: "Tipos de empleado" },
        { to: "/mesas", titulo: "Mesas" },
        { to: "/pedidos", titulo: "Pedidos" },
        { to: "/inventario", titulo: "Inventario" },
        { to: "/gastos", titulo: "Gastos" }
    ],
    MOZO: [
        { to: "/mesas", titulo: "Mesas" },
        { to: "/pedidos", titulo: "Pedidos" },
        { to: "/reservas", titulo: "Reservas" },
        { to: "/productos", titulo: "Productos" }
    ],
    AYUDANTE_COCINA: [
        { to: "/inventario", titulo: "Inventario" },
        { to: "/productos", titulo: "Productos" }
    ]
};

function MenuGeneral() {
    const { sesion } = useAuth();
    const opciones = OPCIONES_POR_ROL[sesion?.rol] ?? [];

    return (
        <div className="menu-general-pagina">
            <h2 className="text-center my-5 py-4">Menú general</h2>

            <div className="menu-general my-auto">
                {opciones.map((opcion) => (
                    <Link
                        key={opcion.to}
                        to={opcion.to}
                        className="menu-general__item"
                    >
                        <span className="menu-general__pie">
                            <span className="menu-general__titulo">
                                {opcion.titulo}
                            </span>
                            <span className="menu-general__flecha">→</span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MenuGeneral;