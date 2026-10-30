describe("Gestión de clientes", () => {
    it("debe iniciar sesión y crear un cliente Estudiante", () => {
        cy.visit("/login");

        cy.env(["usuario", "contrasenia"]).then((env) => {
            cy.get("#nombreUsuario").should("be.visible").type(env.usuario);

            cy.get("#contrasenia").should("be.visible").type(env.contrasenia, {
                log: false
            });

            cy.contains("button", "Iniciar sesión").click();
        });

        cy.location("pathname").should("eq", "/");

        cy.contains(".navbar-nav a", "Clientes")
            .should("be.visible")
            .click();

        cy.location("pathname").should("eq", "/clientes");

        cy.get('select[name="tipo"]')
            .should("be.visible")
            .select("Estudiante");

        cy.contains("button", "Crear cliente")
            .should("be.enabled")
            .click();

        cy.contains("tbody tr", "Estudiante")
            .should("be.visible")
            .within(() => {
                cy.contains("15%").should("be.visible");
            });
    });
});