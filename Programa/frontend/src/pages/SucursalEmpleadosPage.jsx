import SucursalEmpleadosList from "../components/SucursalEmpleadosList";
import { useSucursal } from "../context/SucursalContext";

function SucursalEmpleadosPage() {
    const { sucursalId } = useSucursal();

    return <SucursalEmpleadosList sucursalId={sucursalId} />;
}

export default SucursalEmpleadosPage;