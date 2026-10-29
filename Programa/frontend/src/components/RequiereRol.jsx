import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RequiereRol({ roles }) {
    const { sesion } = useAuth();

    if (!sesion?.token) {
        return <Navigate to="/login" replace />;
    }

    if (!roles.includes(sesion.rol)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default RequiereRol;