import { createContext, useContext, useState } from "react";

const SucursalContext = createContext(null);

const CLAVE = "sucursalId";

export function SucursalProvider({ children }) {
    // sessionStorage: con F5 no te saca de la sucursal, pero al cerrar la pestaña se pierde
    const [sucursalId, setSucursalId] = useState(() => {
        const guardada = Number(sessionStorage.getItem(CLAVE));
        return guardada > 0 ? guardada : null;
    });

    // Provisorio: cuando exista el login, lo define el rol (solo el dueño puede elegir)
    const [puedeElegir] = useState(true);

    const seleccionarSucursal = (id) => {
        sessionStorage.setItem(CLAVE, id);
        setSucursalId(id);
    };

    const cambiarSucursal = () => {
        sessionStorage.removeItem(CLAVE);
        setSucursalId(null);
    };

    return (
        <SucursalContext.Provider
            value={{ sucursalId, puedeElegir, seleccionarSucursal, cambiarSucursal }}
        >
            {children}
        </SucursalContext.Provider>
    );
}

export const useSucursal = () => useContext(SucursalContext);