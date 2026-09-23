const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API La Pastelería",
            version: "1.0.0",
            description: "API REST de La Pastelería"
        },
        servers: [
            {url: "http://localhost:3000"}
        ]
    },
    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;