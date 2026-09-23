-- CreateTable
CREATE TABLE `Producto` (
    `idProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `tipoProducto` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `precio` DOUBLE NOT NULL,
    `precioFinal` DOUBLE NULL,
    `proveedor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stock` INTEGER NOT NULL,
    `stockMin` INTEGER NOT NULL,
    `sucursalId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,

    UNIQUE INDEX `Inventario_sucursalId_productoId_key`(`sucursalId`, `productoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Inventario` ADD CONSTRAINT `Inventario_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventario` ADD CONSTRAINT `Inventario_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`idProducto`) ON DELETE RESTRICT ON UPDATE CASCADE;
