import SucursalList from "../components/SucursalList";
import GastoList from "../components/GastoList";
import ClienteList from "../components/ClienteList";
import TipoEmpleadoList from "../components/TipoEmpleadoList";

function AdministracionPage() {
    return (
        <>
            <SucursalList />
            <hr className="my-5" />
            <GastoList />
            <hr className="my-5" />
            <ClienteList />
            <hr className="my-5" />
            <TipoEmpleadoList />
            <hr className="my-5" />
            <SucursalTipoEmpleadoList />
        </>
    );
}

export default AdministracionPage;