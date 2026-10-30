import ClienteList from "../components/ClienteList";
import { useAuth } from "../context/AuthContext";

function ClientesPage() {
    const { sesion } = useAuth();

    if (sesion?.rol === "MOZO") {
        return null;
    }

    return <ClienteList />;
}

export default ClientesPage;