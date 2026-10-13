import SucursalList from "./components/SucursalList";
import ProductoList from "./components/ProductoList";
import InventarioList from "./components/InventarioList";
<<<<<<< HEAD
import ReservaList from "./components/ReservaList";
import MesaList from "./components/MesaList";
import ClienteList from "./components/ClienteList";
import PagoList from "./components/PagoList";
=======
import TipoEmpleadoList from "./components/TipoEmpleadoList";
import SucursalTipoEmpleadoList from "./components/SucursalTipoEmpleadoList";
import GastoList from "./components/GastoList";
>>>>>>> origin/tipoEmpleado

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
            <ClienteList />
            <hr className="my-5" />
            <PagoList />
            <hr className="my-5" />
=======
            <hr className="my-5" />
            <TipoEmpleadoList />
            <hr className="my-5" />
            <SucursalTipoEmpleadoList />
            <hr className="my-5" />
            <GastoList />
>>>>>>> origin/tipoEmpleado
        </div>
    );
}

export default App;