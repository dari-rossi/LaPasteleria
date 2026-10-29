/*
  Warnings:

  - You are about to drop the column `precioFinal` on the `producto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `producto` DROP COLUMN `precioFinal`;

-- CreateTable
CREATE TABLE `Pedido` (
    `idPedido` INTEGER NOT NULL AUTO_INCREMENT,
    `estadoPedido` VARCHAR(191) NOT NULL,
    `comensales` INTEGER NOT NULL,
    `mesaId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `sucursalId` INTEGER NOT NULL,

    PRIMARY KEY (`idPedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemProducto` (
    `idItemProducto` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `subTotal` DOUBLE NOT NULL,
    `pedidoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,

    UNIQUE INDEX `ItemProducto_pedidoId_productoId_key`(`pedidoId`, `productoId`),
    PRIMARY KEY (`idItemProducto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pago` ADD CONSTRAINT `Pago_idPedido_fkey` FOREIGN KEY (`idPedido`) REFERENCES `Pedido`(`idPedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_mesaId_fkey` FOREIGN KEY (`mesaId`) REFERENCES `Mesa`(`idMesa`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemProducto` ADD CONSTRAINT `ItemProducto_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`idPedido`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemProducto` ADD CONSTRAINT `ItemProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`idProducto`) ON DELETE RESTRICT ON UPDATE CASCADE;
