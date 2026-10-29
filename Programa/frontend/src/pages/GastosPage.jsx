import GastoList from "../components/GastoList";
import { useSucursal } from "../context/SucursalContext";

function GastosPage() {
    const { sucursalId } = useSucursal();
    return <GastoList sucursalId={sucursalId} />;
}

export default GastosPage;
