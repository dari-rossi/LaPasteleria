import SucursalList from "./components/SucursalList";
import ProductoList from "./components/ProductoList";
import InventarioList from "./components/InventarioList";
import ReservaList from "./components/ReservaList";
import MesaList from "./components/MesaList";

function App() {
    return (
        <div className="container mt-4">
            <h1>La Pastelería</h1>
            <SucursalList />
            <hr className="my-5" />
            <ProductoList />
            <hr className="my-5" />
            <InventarioList />
            <ReservaList/>
            <hr className= "my-5" />
            <MesaList />
            <hr className="my-5" />
        </div>
    );
}

export default App;