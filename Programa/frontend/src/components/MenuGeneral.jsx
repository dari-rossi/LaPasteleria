import { Link } from "react-router-dom";

const OPCIONES = [
    { to: "/sucursales", titulo: "Sucursales" },
    { to: "/productos", titulo: "Productos" },
    { to: "/tipos-empleado", titulo: "Tipos de empleado" },
    { to: "/informes", titulo: "Informes" }

];

function MenuGeneral() {
    return (
        <div className="menu-general-pagina">
            <h2 className="text-center my-5 py-4">Menú general</h2>

            <div className="menu-general my-auto">
                {OPCIONES.map((opcion) => (
                    <Link key={opcion.to} to={opcion.to} className="menu-general__item">
                        <span className="menu-general__pie">
                            <span className="menu-general__titulo">{opcion.titulo}</span>
                            <span className="menu-general__flecha">→</span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MenuGeneral;