-- CreateTable
CREATE TABLE `TipoEmpleado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(191) NULL,
    `contrasenia` VARCHAR(191) NULL,
    `tipoEmpleado` VARCHAR(191) NOT NULL,
    `sueldo` DOUBLE NOT NULL,

    UNIQUE INDEX `TipoEmpleado_usuario_key`(`usuario`),
    UNIQUE INDEX `TipoEmpleado_tipoEmpleado_key`(`tipoEmpleado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SucursalTipoEmpleado` (
    `cantidad` INTEGER NOT NULL,
    `sucursalId` INTEGER NOT NULL,
    `tipoEmpleadoId` INTEGER NOT NULL,

    PRIMARY KEY (`sucursalId`, `tipoEmpleadoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gasto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaGasto` DATE NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `costo` DOUBLE NOT NULL,
    `sucursalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SucursalTipoEmpleado` ADD CONSTRAINT `SucursalTipoEmpleado_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SucursalTipoEmpleado` ADD CONSTRAINT `SucursalTipoEmpleado_tipoEmpleadoId_fkey` FOREIGN KEY (`tipoEmpleadoId`) REFERENCES `TipoEmpleado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gasto` ADD CONSTRAINT `Gasto_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
