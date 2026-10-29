import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
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

const Pendiente = ({ nombre }) => (
    <p className="text-muted">{nombre}: pendiente.</p>
);

function RequiereLogin({ children }) {
    const { autenticado } = useAuth();

    return autenticado
        ? children
        : <Navigate to="/login" replace />;
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
                                <MenuGeneralPage />
                            </RequiereLogin>
                        }
                    />

                    {/* Opciones del dueño */}
                    <Route element={
                        <RequiereRol roles={["DUENIO"]} />
                    }>
                        <Route path="/sucursales" element={<SucursalesPage />} />
                        <Route path="/informes" element={<InformesPage />} />
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
                            <Route path="/gastos" element={<GastosPage />} />
                            <Route
                                path="/planilla"
                                element={<Pendiente nombre="Planilla" />}
                            />
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
                        </Route>

                        {/* Solo mozo */}
                        <Route element={
                            <RequiereRol roles={["MOZO"]} />
                        }>
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