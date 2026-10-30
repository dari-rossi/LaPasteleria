describe("Gestión de clientes", () => {
    it("debe iniciar sesión y crear un cliente Estudiante", () => {
        cy.visit("/login");

        cy.env(["usuario", "contrasenia"]).then((env) => {
            cy.get("#nombreUsuario").type(env.usuario);

            cy.get("#contrasenia").type(env.contrasenia, {
                log: false
            });
        });

        cy.contains("button", "Iniciar sesión").click();
        cy.location("pathname").should("eq", "/");

        cy.contains(".navbar-nav a", "Clientes").click();
        cy.location("pathname").should("eq", "/clientes");

        cy.get('select[name="tipo"]').select("Estudiante");
        cy.contains("button", "Crear cliente").click();

        cy.contains("tbody tr", "Estudiante")
            .should("be.visible")
            .and("contain", "15%");
    });
});