import { createContext, useContext, useState } from "react";

const SucursalContext = createContext(null);
const CLAVE = "sucursalId";

// Provisorio: cuando exista el login, esto sale del usuario logueado
// (un empleado de una sucursal no puede elegir, un administrador sí)
const PUEDE_ELEGIR = true;

export function SucursalProvider({ children }) {
    // Se guarda en localStorage para que al refrescar la página no se pierda la sucursal
    const [sucursalId, setSucursalId] = useState(() => {
        const guardada = localStorage.getItem(CLAVE);
        return guardada ? Number(guardada) : null;
    });

    // cambiarSucursal(id) elige una sucursal; cambiarSucursal() deja de trabajar en una
    const cambiarSucursal = (id = null) => {
        setSucursalId(id);

        if (id === null) {
            localStorage.removeItem(CLAVE);
        } else {
            localStorage.setItem(CLAVE, String(id));
        }
    };

    return (
        <SucursalContext.Provider value={{ sucursalId, puedeElegir: PUEDE_ELEGIR, cambiarSucursal }}>
            {children}
        </SucursalContext.Provider>
    );
}

export const useSucursal = () => {
    const contexto = useContext(SucursalContext);

    if (!contexto) {
        throw new Error("useSucursal tiene que usarse dentro de SucursalProvider");
    }

    return contexto;
};