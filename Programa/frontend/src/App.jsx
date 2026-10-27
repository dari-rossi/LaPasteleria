import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductosPage from "./pages/ProductosPage";
import InventarioPage from "./pages/InventarioPage";


function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Navigate to="/productos" replace />} />
                    <Route path="/productos" element={<ProductosPage />} />
                    <Route path="/inventario" element={<InventarioPage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;