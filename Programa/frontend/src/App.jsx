import SucursalList from "./components/SucursalList";
import ProductoList from "./components/ProductoList";
import InventarioList from "./components/InventarioList";

function App() {
    return (
        <div className="container mt-4">
            <h1>La Pastelería</h1>
            <SucursalList />
            <hr className="my-5" />
            <ProductoList />
            <hr className="my-5" />
            <InventarioList />
        </div>
    );
}

export default App;