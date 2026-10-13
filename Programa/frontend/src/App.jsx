import SucursalList from "./components/SucursalList";
import ProductoList from "./components/ProductoList";
import InventarioList from "./components/InventarioList";
<<<<<<< HEAD
import ReservaList from "./components/ReservaList";
import MesaList from "./components/MesaList";
=======
import ClienteList from "./components/ClienteList";
import PagoList from "./components/PagoList";
>>>>>>> origin/crud-cliente-pago

function App() {
    return (
        <div className="container mt-4">
            <h1>La Pastelería</h1>
            <SucursalList />
            <hr className="my-5" />
            <ProductoList />
            <hr className="my-5" />
            <InventarioList />
<<<<<<< HEAD
            <ReservaList/>
            <hr className= "my-5" />
            <MesaList />
=======
            <ClienteList />
            <hr className="my-5" />
            <PagoList />
>>>>>>> origin/crud-cliente-pago
            <hr className="my-5" />
        </div>
    );
}

export default App;