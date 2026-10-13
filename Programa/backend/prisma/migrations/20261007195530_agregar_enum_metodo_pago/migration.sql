/*
  Warnings:

  - You are about to alter the column `metodoPago` on the `pago` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `pago` MODIFY `metodoPago` ENUM('Efectivo', 'Tarjeta', 'Transferencia') NOT NULL;
