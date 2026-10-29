import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const SucursalContext = createContext(null);
const CLAVE = "sucursalId";

export function SucursalProvider({ children }) {
    const { sesion } = useAuth();
    const esDuenio = sesion?.rol === "DUENIO";

    const [sucursalElegida, setSucursalElegida] = useState(() => {
        const guardada = localStorage.getItem(CLAVE);
        return guardada ? Number(guardada) : null;
    });

    const sucursalId = esDuenio
        ? sucursalElegida
        : sesion?.sucursalId ?? null;

    useEffect(() => {
        if (!sesion) {
            setSucursalElegida(null);
            localStorage.removeItem(CLAVE);
            return;
        }

        if (!esDuenio) {
            setSucursalElegida(null);
            localStorage.removeItem(CLAVE);
        }
    }, [sesion, esDuenio]);

    const cambiarSucursal = (id = null) => {
        if (!esDuenio) {
            return;
        }

        const nuevaSucursal = id === null ? null : Number(id);

        setSucursalElegida(nuevaSucursal);

        if (nuevaSucursal === null) {
            localStorage.removeItem(CLAVE);
        } else {
            localStorage.setItem(CLAVE, String(nuevaSucursal));
        }
    };

    return (
        <SucursalContext.Provider
            value={{
                sucursalId,
                puedeElegir: esDuenio,
                cambiarSucursal
            }}
        >
            {children}
        </SucursalContext.Provider>
    );
}

export const useSucursal = () => {
    const contexto = useContext(SucursalContext);

    if (!contexto) {
        throw new Error(
            "useSucursal tiene que usarse dentro de SucursalProvider"
        );
    }

    return contexto;
};