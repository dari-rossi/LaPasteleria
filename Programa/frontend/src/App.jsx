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
import GastosPage from "./pages/GastosPage";
import TiposEmpleadosPage from "./pages/TiposEmpleadosPage";
import InformesPage from "./pages/InformesPage";

// Placeholder para las secciones que todavía no tienen página
const Pendiente = ({ nombre }) => <p className="text-muted">{nombre}: pendiente.</p>;

function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
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
                        <Route path="/empleados" element={<Pendiente nombre="Empleados" />} />
                        <Route path="/reservas" element={<ReservasPage/>} />
                        <Route path="/gastos" element={<GastosPage/>} />
                        <Route path="/planilla" element={<Pendiente nombre="Planilla" />} />
                    </Route>
                </Routes>
            </div>
        </>
    );
}

export default App;