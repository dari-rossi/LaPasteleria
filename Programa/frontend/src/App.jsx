import SucursalList from "./components/SucursalList";
import ProductoList from "./components/ProductoList";
import InventarioList from "./components/InventarioList";
import TipoEmpleadoList from "./components/TipoEmpleadoList";
import SucursalTipoEmpleadoList from "./components/SucursalTipoEmpleadoList";
import GastoList from "./components/GastoList";

function App() {
    return (
        <div className="container mt-4">
            <h1>La Pastelería</h1>
            <SucursalList />
            <hr className="my-5" />
            <ProductoList />
            <hr className="my-5" />
            <InventarioList />
            <hr className="my-5" />
            <TipoEmpleadoList />
            <hr className="my-5" />
            <SucursalTipoEmpleadoList />
            <hr className="my-5" />
            <GastoList />
        </div>
    );
}

export default App;