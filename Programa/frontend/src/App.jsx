import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MesasPage from "./pages/MesasPage";
import PedidosPage from "./pages/PedidosPage";
import PedidoDetallePage from "./pages/PedidoDetallePage";

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
                </Routes>
            </div>
        </>
    );
}

export default App;