import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MesasPage from "./pages/MesasPage";
import PedidosPage from "./pages/PedidosPage";
import PedidoDetallePage from "./pages/PedidoDetallePage";
import ReservasPage from "./pages/ReservasPage";

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

function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Navigate to="/mesas" replace />} />
                    <Route path="/mesas" element={<MesasPage />} />
                    <Route path="/pedidos" element={<PedidosPage />} />
                    <Route path="/pedidos/:id" element={<PedidoDetallePage />} />
                    <Route path="/reservas" element={<ReservasPage />} />

                    <Route
                        path="/administracion"
                        element={
                            <div className="mt-4">
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
                            </div>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;