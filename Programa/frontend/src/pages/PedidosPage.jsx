import PedidosList from "../components/PedidosList";
import { useSucursal } from "../context/SucursalContext";

function PedidosPage() {
    const { sucursalId } = useSucursal();

    return <PedidosList sucursalId={sucursalId} />;
}

export default PedidosPage;