import SucursalList from "./components/SucursalList";
import ProductoList from "./components/ProductoList";
import InventarioList from "./components/InventarioList";
import ClienteList from "./components/ClienteList";
import PagoList from "./components/PagoList";

function App() {
    return (
        <div className="container mt-4">
            <h1>La Pastelería</h1>
            <SucursalList />
            <hr className="my-5" />
            <ProductoList />
            <hr className="my-5" />
            <InventarioList />
            <ClienteList />
            <hr className="my-5" />
            <PagoList />
            <hr className="my-5" />
        </div>
    );
}

export default App;