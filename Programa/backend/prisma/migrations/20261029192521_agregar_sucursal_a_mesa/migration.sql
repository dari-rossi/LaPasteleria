/*
  Warnings:

  - You are about to drop the column `precioFinal` on the `producto` table. All the data in the column will be lost.
  - Added the required column `sucursalId` to the `Mesa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mesa` ADD COLUMN `sucursalId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `producto` DROP COLUMN `precioFinal`;

-- AddForeignKey
ALTER TABLE `Mesa` ADD CONSTRAINT `Mesa_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
