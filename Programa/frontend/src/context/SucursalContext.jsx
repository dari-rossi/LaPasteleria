import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const SucursalContext = createContext(null);
const CLAVE = "sucursalId";

// La interfaz del hook no cambia (sucursalId, puedeElegir, cambiarSucursal),
// así que las páginas que ya usan useSucursal() siguen funcionando igual.
export function SucursalProvider({ children }) {
    const { usuario, esDuenio } = useAuth();

    // Sucursal que eligió el Dueño. Se guarda en localStorage para que al refrescar no se pierda.
    const [elegida, setElegida] = useState(() => {
        const guardada = localStorage.getItem(CLAVE);
        return guardada ? Number(guardada) : null;
    });

    // Al cerrar sesión se olvida la sucursal elegida,
    // así la próxima persona que entre no la hereda
    useEffect(() => {
        if (!usuario) {
            setElegida(null);
            localStorage.removeItem(CLAVE);
        }
    }, [usuario]);

    // Dueño: la que eligió (o ninguna, y está en el menú general).
    // Empleado: siempre la suya, la que vino en el login.
    const sucursalId = esDuenio ? elegida : (usuario?.sucursalId ?? null);

    // cambiarSucursal(id) elige una sucursal; cambiarSucursal() deja de trabajar en una.
    // Solo el Dueño puede elegir.
    const cambiarSucursal = (id = null) => {
        if (!esDuenio) {
            return;
        }

        setElegida(id);

        if (id === null) {
            localStorage.removeItem(CLAVE);
        } else {
            localStorage.setItem(CLAVE, String(id));
        }
    };

    return (
        <SucursalContext.Provider
            value={{ sucursalId, puedeElegir: esDuenio, cambiarSucursal }}
        >
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