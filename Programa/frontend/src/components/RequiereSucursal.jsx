import { Navigate, Outlet } from "react-router-dom";
import { useSucursal } from "../context/SucursalContext";

function RequiereSucursal() {
    const { sucursalId } = useSucursal();

    return sucursalId ? <Outlet /> : <Navigate to="/" replace />;
}

export default RequiereSucursal;