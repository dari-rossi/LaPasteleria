import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const CLAVE_SESION = "sesion";

export function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(() => {
        try {
            const guardada = localStorage.getItem(CLAVE_SESION);
            return guardada ? JSON.parse(guardada) : null;
        } catch {
            localStorage.removeItem(CLAVE_SESION);
            return null;
        }
    });

    const iniciarSesion = (datos) => {
        const nuevaSesion = {
            token: datos.token,
            nombreUsuario: datos.nombreUsuario,
            rol: datos.rol,
            sucursalId: datos.sucursalId
        };

        localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
        setSesion(nuevaSesion);
    };

    const cerrarSesion = () => {
        localStorage.removeItem(CLAVE_SESION);
        localStorage.removeItem("sucursalId");
        setSesion(null);
    };

    return (
        <AuthContext.Provider value={{
            sesion,
            autenticado: Boolean(sesion?.token),
            iniciarSesion,
            cerrarSesion
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        throw new Error("useAuth tiene que usarse dentro de AuthProvider");
    }

    return contexto;
};