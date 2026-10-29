/*
  Warnings:

  - A unique constraint covering the columns `[mercadoPagoOrderId]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `pago` MODIFY `metodoPago` ENUM('Efectivo', 'Tarjeta', 'Transferencia', 'MercadoPago') NOT NULL;

-- AlterTable
ALTER TABLE `pedido` ADD COLUMN `mercadoPagoOrderId` VARCHAR(191) NULL,
    ADD COLUMN `mercadoPagoPrecio` DOUBLE NULL,
    ADD COLUMN `mercadoPagoPrecioFinal` DOUBLE NULL,
    ADD COLUMN `mercadoPagoQrData` TEXT NULL,
    ADD COLUMN `mercadoPagoTipoDescuento` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pedido_mercadoPagoOrderId_key` ON `Pedido`(`mercadoPagoOrderId`);
