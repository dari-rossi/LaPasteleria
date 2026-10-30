const clienteRepository = require("../repositories/cliente.repository");
const clienteService = require("../services/cliente.service");

jest.mock("../repositories/cliente.repository");

describe("crearCliente", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("debe asignar un descuento del 20% a un cliente Jubilado", async () => {
        clienteRepository.crear.mockResolvedValue({
            tipo: "Jubilado",
            descuento: 20
        });

        const resultado = await clienteService.crearCliente({
            tipo: "Jubilado"
        });

        expect(clienteRepository.crear).toHaveBeenCalledWith({
            tipo: "Jubilado",
            descuento: 20
        });

        expect(resultado.descuento).toBe(20);
    });

    test("debe asignar un descuento del 15% a un cliente Estudiante", async () => {
        clienteRepository.crear.mockResolvedValue({
            tipo: "Estudiante",
            descuento: 15
        });

        const resultado = await clienteService.crearCliente({
            tipo: "Estudiante"
        });

        expect(clienteRepository.crear).toHaveBeenCalledWith({
            tipo: "Estudiante",
            descuento: 15
        });

        expect(resultado.descuento).toBe(15);
    });

    test("debe asignar un descuento del 0% a un cliente General", async () => {
        clienteRepository.crear.mockResolvedValue({
            tipo: "General",
            descuento: 0
        });

        const resultado = await clienteService.crearCliente({
            tipo: "General"
        });

        expect(clienteRepository.crear).toHaveBeenCalledWith({
            tipo: "General",
            descuento: 0
        });

        expect(resultado.descuento).toBe(0);
    });
});

describe("modificarCliente", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("debe modificar únicamente el descuento de un cliente existente", async () => {
        clienteRepository.obtenerPorId.mockResolvedValue({
            id: 1,
            tipo: "Jubilado",
            descuento: 20
        });

        clienteRepository.modificar.mockResolvedValue({
            id: 1,
            tipo: "Jubilado",
            descuento: 15
        });

        const resultado = await clienteService.modificarCliente(1, {
            descuento: 15
        });

        expect(clienteRepository.modificar).toHaveBeenCalledWith(1, {
            descuento: 15
        });

        expect(resultado.tipo).toBe("Jubilado");
        expect(resultado.descuento).toBe(15);
    });

    test("no debe modificar un cliente inexistente", async () => {
        clienteRepository.obtenerPorId.mockResolvedValue(null);

        await expect(
            clienteService.modificarCliente(99, { descuento: 15 })
        ).rejects.toBeDefined();

        expect(clienteRepository.modificar).not.toHaveBeenCalled();
    });
});

describe("eliminarCliente", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("debe eliminar un cliente existente", async () => {
        clienteRepository.obtenerPorId.mockResolvedValue({
            id: 1,
            tipo: "General",
            descuento: 0
        });

        clienteRepository.eliminar.mockResolvedValue({
            id: 1,
            tipo: "General",
            descuento: 0
        });

        const resultado = await clienteService.eliminarCliente(1);

        expect(clienteRepository.obtenerPorId).toHaveBeenCalledWith(1);
        expect(clienteRepository.eliminar).toHaveBeenCalledWith(1);
        expect(resultado.id).toBe(1);
    });

    test("no debe eliminar un cliente inexistente", async () => {
        clienteRepository.obtenerPorId.mockResolvedValue(null);

        await expect(
            clienteService.eliminarCliente(99)
        ).rejects.toBeDefined();

        expect(clienteRepository.eliminar).not.toHaveBeenCalled();
    });
});

describe("obtenerClientePorId", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("debe obtener un cliente existente por su ID", async () => {
        clienteRepository.obtenerPorId.mockResolvedValue({
            id: 1,
            tipo: "Jubilado",
            descuento: 20
        });

        const resultado = await clienteService.obtenerClientePorId(1);

        expect(clienteRepository.obtenerPorId).toHaveBeenCalledWith(1);
        expect(resultado).toEqual({
            id: 1,
            tipo: "Jubilado",
            descuento: 20
        });
    });

    test("debe generar un error si el cliente no existe", async () => {
        clienteRepository.obtenerPorId.mockResolvedValue(null);

        await expect(
            clienteService.obtenerClientePorId(99)
        ).rejects.toBeDefined();
    });
});