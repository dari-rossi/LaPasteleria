const { execSync } = require("child_process");

// Primero los datos generales (incluye los roles) y después los usuarios
execSync("node prisma/seed.js", { stdio: "inherit" });
execSync("node prisma/seedAccesos.js", { stdio: "inherit" });