const ERRORES = {
    // ----- Generales -----
    ID_INCORRECTO: { status: 400, mensaje: "ID incorrecto" },
    DATOS_INVALIDOS: { status: 400, mensaje: "Datos inválidos" },
    JSON_INVALIDO: { status: 400, mensaje: "El cuerpo de la petición no es un JSON válido" },
    RUTA_NO_ENCONTRADA: { status: 404, mensaje: "La ruta solicitada no existe" },
    ERROR_INTERNO: { status: 500, mensaje: "Error interno del servidor" },

    // Errores de base de datos que se detectan solos
    REGISTRO_NO_ENCONTRADO: { status: 404, mensaje: "El registro solicitado no existe" },
    REGISTRO_DUPLICADO: { status: 409, mensaje: "Ya existe un registro con esos datos" },
    REFERENCIA_INVALIDA: { status: 400, mensaje: "Alguno de los datos relacionados no existe" },
    NO_SE_PUEDE_ELIMINAR: { status: 409, mensaje: "No se puede eliminar: tiene registros relacionados" },

    // ----- Autenticación y permisos -----
    SESION_REQUERIDA: { status: 401, mensaje: "Debés iniciar sesión para acceder" },
    TOKEN_INVALIDO: { status: 401, mensaje: "Token inválido o vencido" },
    CREDENCIALES_INVALIDAS: { status: 401, mensaje: "Usuario o contraseña incorrectos" },
    CUENTA_CONFIGURACION_INVALIDA: { status: 500, mensaje: "La cuenta tiene una configuración incorrecta" },
    JWT_SECRET_FALTANTE: { status: 500, mensaje: "Falta configurar JWT_SECRET en el servidor" },
    SIN_PERMISOS: { status: 403, mensaje: "No tenés permisos para realizar esta operación" },
    SOLO_DUENIO: { status: 403, mensaje: "Esta operación solo la puede realizar el dueño" },
    SUCURSAL_NO_PERMITIDA: { status: 403, mensaje: "No tenés acceso a esta sucursal" },
    OTRA_SUCURSAL: { status: 403, mensaje: "No tenés permiso para operar sobre otra sucursal" },

    // ----- Sucursal -----
    SUCURSAL_NO_ENCONTRADA: { status: 404, mensaje: "Sucursal no encontrada" },
    SUCURSAL_TELEFONO_DUPLICADO: { status: 409, mensaje: "Ya existe una sucursal con ese teléfono" },
    SUCURSAL_DIRECCION_DUPLICADA: { status: 409, mensaje: "Ya existe una sucursal con esa dirección" },

    // ----- Producto e inventario -----
    PRODUCTO_NO_ENCONTRADO: { status: 404, mensaje: "Producto no encontrado" },
    INVENTARIO_NO_ENCONTRADO: { status: 404, mensaje: "Inventario no encontrado" },
    INVENTARIO_DUPLICADO: { status: 409, mensaje: "Ese producto ya está cargado en esa sucursal" },
    INVENTARIO_SOLO_STOCK: { status: 403, mensaje: "Solo podés modificar el stock" },

    // ----- Mesa, cliente y reserva -----
    MESA_NO_ENCONTRADA: { status: 404, mensaje: "Mesa no encontrada" },
    MESA_DUPLICADA: { status: 409, mensaje: "Ya hay una mesa en esa posición" },
    CLIENTE_NO_ENCONTRADO: { status: 404, mensaje: "Cliente no encontrado" },
    RESERVA_NO_ENCONTRADA: { status: 404, mensaje: "Reserva no encontrada" },
    RESERVA_CLAVE_INCORRECTA: { status: 400, mensaje: "Mesa o fecha y hora incorrectas" },
    RESERVA_DUPLICADA: { status: 409, mensaje: "Ya existe una reserva para esa mesa en esa fecha y hora" },

    // ----- Pedido, items y pago -----
    PEDIDO_NO_ENCONTRADO: { status: 404, mensaje: "Pedido no encontrado" },
    PEDIDO_CON_PAGO: { status: 409, mensaje: "No se puede eliminar un pedido que ya tiene un pago registrado" },
    ITEM_NO_ENCONTRADO: { status: 404, mensaje: "Item no encontrado" },
    ITEM_DUPLICADO: { status: 409, mensaje: "Ese producto ya está cargado en el pedido" },
    PAGO_NO_ENCONTRADO: { status: 404, mensaje: "Pago no encontrado" },
    PAGO_DUPLICADO: { status: 409, mensaje: "El pedido ya tiene un pago registrado" },
    PAGO_PEDIDO_SIN_PRODUCTOS: { status: 400, mensaje: "No se puede registrar el pago de un pedido sin productos" },

    // ----- Planillas y reservas por sucursal -----
    FECHA_INVALIDA: { status: 400, mensaje: "La fecha es inválida. Usá el formato AAAA-MM-DD" },
    FECHA_FUTURA: { status: 400, mensaje: "La fecha no puede ser futura" },
    MES_INVALIDO: { status: 400, mensaje: "El mes es inválido. Usá el formato AAAA-MM" },
    MES_FUTURO: { status: 400, mensaje: "El mes no puede ser futuro" },
    SUCURSAL_REQUERIDA: { status: 400, mensaje: "Debés indicar una sucursal" },

    // ----- Gasto -----
    GASTO_NO_ENCONTRADO: { status: 404, mensaje: "Gasto no encontrado" },

    // ----- Tipo de empleado y asignación a sucursales -----
    TIPO_EMPLEADO_NO_ENCONTRADO: { status: 404, mensaje: "Tipo de empleado no encontrado" },
    TIPO_EMPLEADO_DUPLICADO: { status: 409, mensaje: "Ese rol ya es parte del sistema" },
    TIPO_EMPLEADO_CON_USUARIOS: { status: 409, mensaje: "No se puede eliminar: hay usuarios que tienen este rol" },
    ROL_INVALIDO: { status: 400, mensaje: "El rol indicado no es válido" },
    ROL_DUENIO_PREDEFINIDO: { status: 409, mensaje: "El Dueño es un rol predefinido: ya es parte del sistema" },
    ASIGNACION_NO_ENCONTRADA: { status: 404, mensaje: "Ese tipo de empleado no está asignado a la sucursal" },
    ASIGNACION_DUPLICADA: { status: 409, mensaje: "Ese tipo de empleado ya está asignado a la sucursal. Modificá su cantidad" },

    // ----- Usuario -----
    USUARIO_NO_ENCONTRADO: { status: 404, mensaje: "Usuario no encontrado" },
    USUARIO_DUPLICADO: { status: 409, mensaje: "Ya existe un usuario con ese nombre" },
    DUENIO_SIN_SUCURSAL: { status: 400, mensaje: "El Dueño no pertenece a una sucursal: tiene acceso a todas" },
    SUCURSAL_OBLIGATORIA: { status: 400, mensaje: "Todos los usuarios, excepto el Dueño, deben pertenecer a una sucursal" },
    DUENIO_DUPLICADO: { status: 409, mensaje: "Ya existe un usuario Dueño" },
    ROL_SUCURSAL_DUPLICADO: { status: 409, mensaje: "Esa sucursal ya tiene un usuario con ese rol" },
    NO_CAMBIAR_PROPIO_ROL: { status: 409, mensaje: "No podés cambiar tu propio rol" },
    NO_ELIMINAR_PROPIA_CUENTA: { status: 409, mensaje: "No podés eliminar tu propia cuenta" }
};

// ============================================================
// Error propio de la aplicación

class AppError extends Error {
    constructor(codigo, mensaje, detalles) {
        const existe = Object.prototype.hasOwnProperty.call(ERRORES, codigo);
        const definicion = ERRORES[existe ? codigo : "ERROR_INTERNO"];

        super(mensaje ?? definicion.mensaje);

        this.name = "AppError";
        this.codigo = existe ? codigo : "ERROR_INTERNO";
        this.status = definicion.status;
        this.detalles = detalles;
    }
}

// Uso:
// lanzarError("USUARIO_NO_ENCONTRADO");
// lanzarError("PRODUCTO_NO_ENCONTRADO", "Texto propio");
// lanzarError("La mesa ya está ocupada.", 409);
const lanzarError = (codigo, mensajeOStatus) => {
    const esDelCatalogo = Object.prototype.hasOwnProperty.call(ERRORES, codigo);

    // Mensaje propio con un status HTTP
    if (!esDelCatalogo && Number.isInteger(mensajeOStatus)) {
        const error = new AppError("ERROR_INTERNO", codigo);
        error.codigo = "ERROR_DE_NEGOCIO";
        error.status = mensajeOStatus;
        throw error;
    }

    // Error del catálogo, con mensaje opcional
    throw new AppError(codigo, mensajeOStatus);
};

// Convierte un parámetro de la URL en un ID válido
const leerId = (valor, codigo = "ID_INCORRECTO") => {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        lanzarError(codigo);
    }

    return id;
};

// ============================================================
// Detección automática del error

const DUPLICADOS_POR_MODELO = {
    Reserva: "RESERVA_DUPLICADA",
    ItemProducto: "ITEM_DUPLICADO",
    Inventario: "INVENTARIO_DUPLICADO",
    Usuario: "USUARIO_DUPLICADO",
    TipoEmpleado: "TIPO_EMPLEADO_DUPLICADO",
    SucursalTipoEmpleado: "ASIGNACION_DUPLICADA",
    Pago: "PAGO_DUPLICADO",
    Mesa: "MESA_DUPLICADA"
};

const esErrorPrisma = (error) =>
    typeof error?.code === "string" && /^P\d{4}$/.test(error.code);

const traducirErrorPrisma = (error, req) => {
    switch (error.code) {
        case "P2002":
            return new AppError(
                DUPLICADOS_POR_MODELO[error.meta?.modelName] ?? "REGISTRO_DUPLICADO"
            );

        case "P2003":
            return new AppError(
                req.method === "DELETE"
                    ? "NO_SE_PUEDE_ELIMINAR"
                    : "REFERENCIA_INVALIDA"
            );

        case "P2025":
            return new AppError("REGISTRO_NO_ENCONTRADO");

        default:
            return null;
    }
};

const identificarError = (error, req) => {
    if (error instanceof AppError) {
        return error;
    }

    if (error?.name === "ZodError") {
        return new AppError("DATOS_INVALIDOS", undefined, error.issues);
    }

    if (error?.type === "entity.parse.failed") {
        return new AppError("JSON_INVALIDO");
    }

    if (
        error?.name === "TokenExpiredError" ||
        error?.name === "JsonWebTokenError"
    ) {
        return new AppError("TOKEN_INVALIDO");
    }

    if (esErrorPrisma(error)) {
        return traducirErrorPrisma(error, req);
    }

    if (error?.name === "PrismaClientValidationError") {
        return new AppError("DATOS_INVALIDOS");
    }

    return null;
};

// ============================================================
// Middlewares de Express

const rutaNoEncontrada = (req, res, next) => {
    next(new AppError("RUTA_NO_ENCONTRADA"));
};

const manejarErrores = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    let appError = identificarError(error, req);

    if (!appError) {
        console.error(error);
        appError = new AppError("ERROR_INTERNO");
    } else if (appError.status >= 500) {
        console.error(error);
    }

    const cuerpo = {
        codigo: appError.codigo,
        error: appError.message
    };

    if (appError.detalles) {
        cuerpo.detalles = appError.detalles;
    }

    res.status(appError.status).json(cuerpo);
};

module.exports = {
    ERRORES,
    AppError,
    lanzarError,
    leerId,
    rutaNoEncontrada,
    manejarErrores
};