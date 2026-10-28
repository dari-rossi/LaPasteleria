import SucursalList from "./components/SucursalList";
import ProductoList from "./components/ProductoList";
import InventarioList from "./components/InventarioList";
import ReservaList from "./components/ReservaList";
import MesaList from "./components/MesaList";
import ClienteList from "./components/ClienteList";
import PagoList from "./components/PagoList";
import TipoEmpleadoList from "./components/TipoEmpleadoList";
import SucursalTipoEmpleadoList from "./components/SucursalTipoEmpleadoList";
import GastoList from "./components/GastoList";
import MercadoPago from "./components/mercadoPago/mercadoPago";

function App() {
    const token = localStorage.getItem("token");

    return (
        <div className="container mt-4">
            <h1>La Pastelería</h1>
            <SucursalList />
            <hr className="my-5" />
            <ProductoList />
            <hr className="my-5" />
            <InventarioList />
            <ReservaList />
            <hr className="my-5" />
            <MesaList />
            <ClienteList />
            <hr className="my-5" />
            <PagoList />
            <hr className="my-5" />
            <TipoEmpleadoList />
            <hr className="my-5" />
            <SucursalTipoEmpleadoList />
            <hr className="my-5" />
            <GastoList />
            <hr className="my-5" />

            <MercadoPago pedidoId={2} token={token} />
        </div>
    );
}

export default App;