import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequiereSucursal from "./components/RequiereSucursal";
import MenuGeneralPage from "./pages/MenuGeneralPage";
import SucursalesPage from "./pages/SucursalesPage";
import SucursalPage from "./pages/SucursalPage";
import ProductosPage from "./pages/ProductosPage";
import InventarioPage from "./pages/InventarioPage";
import MesasPage from "./pages/MesasPage";
import PedidosPage from "./pages/PedidosPage";
import PedidoDetallePage from "./pages/PedidoDetallePage";
import ReservasPage from "./pages/ReservasPage";
<<<<<<< HEAD
import GastosPage from "./pages/GastosPage";
import TiposEmpleadosPage from "./pages/TiposEmpleadosPage";
import InformesPage from "./pages/InformesPage";

// Placeholder para las secciones que todavía no tienen página
const Pendiente = ({ nombre }) => <p className="text-muted">{nombre}: pendiente.</p>;
=======

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
>>>>>>> mercado-pago

function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
<<<<<<< HEAD
                    {/* Menú general: lo que es de todas las sucursales */}
                    <Route path="/" element={<MenuGeneralPage />} />
                    <Route path="/sucursales" element={<SucursalesPage />} />
                    <Route path="/productos" element={<ProductosPage />} />
                    <Route path="/tipos-empleado" element={<TiposEmpleadosPage />} />
                    <Route path="/informes" element={<InformesPage/>} />

                    {/* Secciones de una sucursal: si no hay una elegida, vuelve al menú general */}
                    <Route element={<RequiereSucursal />}>
                        <Route path="/sucursal" element={<SucursalPage />} />
                        <Route path="/pedidos" element={<PedidosPage />} />
                        <Route path="/pedidos/:id" element={<PedidoDetallePage />} />
                        <Route path="/mesas" element={<MesasPage />} />
                        <Route path="/inventario" element={<InventarioPage />} />
                        <Route path="/reservas" element={<ReservasPage/>} />
                        <Route path="/gastos" element={<GastosPage/>} />
                        <Route path="/planilla" element={<Pendiente nombre="Planilla" />} />
                    </Route>
=======
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
>>>>>>> mercado-pago
                </Routes>
            </div>
        </>
    );
}

export default App;