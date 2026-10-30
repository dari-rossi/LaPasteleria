import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import RequiereLogin from "./components/RequiereLogin";
import RequiereSucursal from "./components/RequiereSucursal";
import RequiereRol from "./components/RequiereRol";
import LoginPage from "./pages/LoginPage";
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
import SucursalEmpleadosPage from "./pages/SucursalEmpleadosPage";
import UsuariosPage from "./pages/UsuariosPage";
import ClientesPage from "./pages/ClientesPage";

// Los que no son dueño ya tienen su sucursal asignada: no pasan por el menú
// general, entran directo a su pantalla principal
const INICIO_POR_ROL = {
    GERENTE: "/sucursal",
    MOZO: "/mesas",
    AYUDANTE_COCINA: "/inventario"
};

function Inicio() {
    const { sesion } = useAuth();

    if (sesion?.rol === "DUENIO") {
        return <MenuGeneralPage />;
    }

    const destino = INICIO_POR_ROL[sesion?.rol];

    return destino
        ? <Navigate to={destino} replace />
        : <p className="text-muted">Tu rol no tiene una pantalla asignada.</p>;
}

function App() {
    const { autenticado } = useAuth();

    return (
        <>
            {autenticado && <Navbar />}

            <div className="container">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            autenticado
                                ? <Navigate to="/" replace />
                                : <LoginPage />
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <RequiereLogin>
                                <Inicio />
                            </RequiereLogin>
                        }
                    />

                    {/* Menú general: solo el dueño */}
                    <Route element={
                        <RequiereRol roles={["DUENIO"]} />
                    }>
                        <Route path="/sucursales" element={<SucursalesPage />} />
                        <Route path="/informes" element={<InformesPage />} />
                        <Route path="/usuarios" element={<UsuariosPage />} />
                        <Route path="/clientes" element={<ClientesPage />} />
                    </Route>

                    {/* Dueño y gerente */}
                    <Route element={
                        <RequiereRol roles={["DUENIO", "GERENTE"]} />
                    }>
                        <Route path="/tipos-empleado" element={<TiposEmpleadosPage />} />
                    </Route>

                    {/* Productos: todos pueden consultar */}
                    <Route element={
                        <RequiereRol
                            roles={["DUENIO", "GERENTE", "MOZO", "AYUDANTE_COCINA"]}
                        />
                    }>
                        <Route path="/productos" element={<ProductosPage />} />
                    </Route>

                    {/* Páginas que requieren una sucursal seleccionada */}
                    <Route element={
                        <RequiereLogin>
                            <RequiereSucursal />
                        </RequiereLogin>
                    }>
                        {/* Dueño y gerente */}
                        <Route element={
                            <RequiereRol roles={["DUENIO", "GERENTE"]} />
                        }>
                            <Route path="/sucursal" element={<SucursalPage />} />
                            <Route path="/empleados" element={<SucursalEmpleadosPage />} />
                            <Route path="/gastos" element={<GastosPage />} />
                        </Route>

                        {/* Dueño, gerente y mozo */}
                        <Route element={
                            <RequiereRol roles={["DUENIO", "GERENTE", "MOZO"]} />
                        }>
                            <Route path="/mesas" element={<MesasPage />} />
                        </Route>

                        {/* Dueño, gerente y ayudante de cocina */}
                        <Route element={
                            <RequiereRol
                                roles={["DUENIO", "GERENTE", "AYUDANTE_COCINA"]}
                            />
                        }>
                            <Route path="/inventario" element={<InventarioPage />} />
                        </Route>

                        {/* Dueño, gerente y mozo */}
                        <Route element={
                            <RequiereRol roles={["DUENIO", "GERENTE", "MOZO"]} />
                        }>
                            <Route path="/pedidos" element={<PedidosPage />} />
                            <Route
                                path="/pedidos/:id"
                                element={<PedidoDetallePage />}
                            />
                            <Route path="/reservas" element={<ReservasPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </>
    );
}

export default App;