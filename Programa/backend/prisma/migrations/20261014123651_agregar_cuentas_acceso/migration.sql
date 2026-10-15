-- CreateTable
CREATE TABLE `CuentaAcceso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(191) NOT NULL,
    `contraseniaHash` VARCHAR(191) NOT NULL,
    `rol` ENUM('DUENIO', 'GERENTE', 'MOZO', 'AYUDANTE_COCINA') NOT NULL,
    `sucursalId` INTEGER NULL,

    UNIQUE INDEX `CuentaAcceso_usuario_key`(`usuario`),
    UNIQUE INDEX `CuentaAcceso_rol_sucursalId_key`(`rol`, `sucursalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CuentaAcceso` ADD CONSTRAINT `CuentaAcceso_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
