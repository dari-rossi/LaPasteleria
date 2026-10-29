import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RequiereLogin({ children }) {
    const { autenticado } = useAuth();

    return autenticado ? children : <Navigate to="/login" replace />;
}

export default RequiereLogin;