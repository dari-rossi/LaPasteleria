import InventarioList from "../components/InventarioList";
import { useSucursal } from "../context/SucursalContext";

function InventarioPage() {
    const { sucursalId } = useSucursal();
    return <InventarioList sucursalId={sucursalId} />;
}

export default InventarioPage;