import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerMesas, eliminarMesa } from "../services/mesaService";
import { obtenerClientes } from "../services/clienteService";
import { crearPedido } from "../services/pedidoService";
import { useSucursal } from "../context/SucursalContext";
import MesaForm from "./MesaForm";
import MesaPanel from "./MesaPanel";

const COLORES = {
    Libre: "#4caf50",
    Ocupada: "#e53935",
    Reservada: "#fdd835"
};

const LEYENDA = [
    { estado: "Libre", etiqueta: "Libres" },
    { estado: "Ocupada", etiqueta: "Ocupadas" },
    { estado: "Reservada", etiqueta: "Reservadas" }
];

const COLUMNAS_MINIMAS = 4;

function MesaGrid({ onReservaCreada }) {
    const navigate = useNavigate();
    const { sucursalId } = useSucursal();
    const [mesas, setMesas] = useState([]);
    const [error, setError] = useState("");
    const [seleccionada, setSeleccionada] = useState(null);
    const [modoFormulario, setModoFormulario] = useState(null);
    const [clientes, setClientes] = useState([]);

    const refrescarMesas = async () => {
        try {
            const datos = await obtenerMesas();
            setMesas(datos);
            setSeleccionada((actual) =>
                actual ? datos.find((mesa) => mesa.idMesa === actual.idMesa) ?? null : null
            );
        } catch (error) {
            // Si falla un refresco automático no se muestra error
        }
    };

    useEffect(() => {
        cargarMesas();
        cargarClientes();

        const intervalo = setInterval(refrescarMesas, 30000);
        return () => clearInterval(intervalo);
    }, [sucursalId]);

    const cargarMesas = async () => {
        try {
            const datos = await obtenerMesas();
            setMesas(datos);
            setSeleccionada(null);
            setModoFormulario(null);
            setError("");
        } catch (error) {
            setError("No se pudieron cargar las mesas.");
        }
    };

    const cargarClientes = async () => {
        try {
            setClientes(await obtenerClientes());
        } catch (error) {
            setError("No se pudieron cargar los clientes.");
        }
    };

    const contar = (estado) => mesas.filter((mesa) => mesa.estado === estado).length;

    const empezarPedido = async (comensales, clienteId) => {
        const pedido = await crearPedido({
            mesaId: seleccionada.idMesa,
            comensales,
            clienteId,
            sucursalId
        });

        navigate(`/pedidos/${pedido.idPedido}`);
    };

    const agregarMesa = (nuevaMesa) => {
        setMesas([...mesas, nuevaMesa]);
        setModoFormulario(null);
    };

    const actualizarMesa = (mesaModificada) => {
        setMesas(
            mesas.map((mesa) =>
                mesa.idMesa === mesaModificada.idMesa ? mesaModificada : mesa
            )
        );
        setSeleccionada(null);
        setModoFormulario(null);
    };

    const borrarMesa = async () => {
        const confirmar = window.confirm(
            `¿Está seguro de que desea eliminar la mesa ${seleccionada.numero}?`
        );

        if (!confirmar) {
            return;
        }

        try {
            await eliminarMesa(seleccionada.idMesa);

            setMesas(mesas.filter((mesa) => mesa.idMesa !== seleccionada.idMesa));
            setSeleccionada(null);
            setModoFormulario(null);
        } catch (error) {
            setError("No se pudo eliminar la mesa.");
        }
    };

    const columnas = Math.max(COLUMNAS_MINIMAS, ...mesas.map((mesa) => mesa.columna ?? 1));

    return (
        <div>
            <h2 className="mb-3">Gestión de Mesas</h2>

            <div className="row">
                {/* Columna de las mesas */}
                <div className={seleccionada ? "col-md-8" : "col-12"}>
                    {mesas.length === 0 && !error ? (
                        <p>No hay mesas registradas.</p>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${columnas}, 120px)`,
                                gap: 16
                            }}
                        >
                            {mesas.map((mesa) => {
                                const estaSeleccionada = seleccionada?.idMesa === mesa.idMesa;

                                return (
                                    <div
                                        key={mesa.idMesa}
                                        onClick={() => setSeleccionada(mesa)}
                                        className="text-white text-center rounded p-3"
                                        style={{
                                            gridRow: mesa.fila,
                                            gridColumn: mesa.columna,
                                            cursor: "pointer",
                                            background: COLORES[mesa.estado] ?? "#9e9e9e",
                                            outline: estaSeleccionada ? "4px solid #757575" : "none",
                                            outlineOffset: 2
                                        }}
                                    >
                                        <div style={{ fontSize: "2.2rem", fontWeight: 700, lineHeight: 1.1 }}>
                                            {mesa.numero}
                                        </div>
                                        <div>👥 {mesa.maxComensales}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <p className="text-muted mt-3">
                        Hacé clic en una mesa para seleccionarla y poder editarla o eliminarla.
                    </p>
                </div>

                {/* Columna del panel lateral */}
                {seleccionada && (
                    <div className="col-md-4">
                        <MesaPanel
                            mesa={seleccionada}
                            clientes={clientes}
                            onEmpezarPedido={empezarPedido}
                            onReservaCreada={() => {
                                refrescarMesas();
                                if (onReservaCreada) onReservaCreada();
                            }}
                            onCerrar={() => {
                                setSeleccionada(null);
                                setModoFormulario(null);
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="my-3">
                <button
                    className="btn btn-primary me-2"
                    onClick={() => setModoFormulario("crear")}
                >
                    Agregar
                </button>
                <button
                    className="btn btn-outline-primary me-2"
                    disabled={!seleccionada}
                    onClick={() => setModoFormulario("editar")}
                >
                    Editar
                </button>
                <button
                    className="btn btn-outline-danger me-2"
                    disabled={!seleccionada}
                    onClick={borrarMesa}
                >
                    Eliminar
                </button>
            </div>

            {/* Leyenda con la cantidad de mesas por estado */}
            <div className="mb-4">
                {LEYENDA.map((item) => (
                    <span key={item.estado} className="d-inline-flex align-items-center me-4">
                        <span
                            className="me-2"
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                background: COLORES[item.estado]
                            }}
                        />
                        {item.etiqueta}: {contar(item.estado)}
                    </span>
                ))}
            </div>

            {(modoFormulario === "crear" || (modoFormulario === "editar" && seleccionada)) && (
                <>
                    <MesaForm
                        key={modoFormulario === "editar" ? `editar-${seleccionada.idMesa}` : "crear"}
                        mesaEditar={modoFormulario === "editar" ? seleccionada : null}
                        onMesaCreada={agregarMesa}
                        onMesaModificada={actualizarMesa}
                        onCancelarEdicion={() => setModoFormulario(null)}
                    />

                    {modoFormulario === "crear" && (
                        <button
                            className="btn btn-link mb-3 p-0"
                            onClick={() => setModoFormulario(null)}
                        >
                            Cerrar formulario
                        </button>
                    )}
                </>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
        </div>
    );
}

export default MesaGrid;