import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ClienteList from "../components/ClienteList";
import { obtenerClientes } from "../services/clienteService";

vi.mock("../services/clienteService", () => ({
    obtenerClientes: vi.fn(),
    eliminarCliente: vi.fn()
}));

vi.mock("../components/ClienteForm", () => ({
    default: () => <div>Formulario de cliente</div>
}));

describe("ClienteList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("debe mostrar los clientes obtenidos del servicio", async () => {
        obtenerClientes.mockResolvedValue([
            { id: 1, tipo: "Jubilado", descuento: 20 },
            { id: 2, tipo: "Estudiante", descuento: 15 }
        ]);

        render(<ClienteList />);

        expect(await screen.findByText("Jubilado")).toBeInTheDocument();
        expect(screen.getByText("Estudiante")).toBeInTheDocument();
        expect(screen.getByText("20%")).toBeInTheDocument();
        expect(screen.getByText("15%")).toBeInTheDocument();
    });

    test("debe mostrar un mensaje cuando no hay clientes", async () => {
        obtenerClientes.mockResolvedValue([]);

        render(<ClienteList />);

        expect(
            await screen.findByText("No hay clientes registrados.")
        ).toBeInTheDocument();
    });

    test("debe mostrar un error si no se pueden cargar los clientes", async () => {
        obtenerClientes.mockRejectedValue(new Error("Error de conexión"));

        render(<ClienteList />);

        expect(
            await screen.findByText("No se pudieron cargar los clientes.")
        ).toBeInTheDocument();
    });
});