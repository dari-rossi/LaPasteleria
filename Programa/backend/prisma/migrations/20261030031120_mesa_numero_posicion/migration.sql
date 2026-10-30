/*
  Warnings:

  - A unique constraint covering the columns `[sucursalId,numero]` on the table `Mesa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sucursalId,fila,columna]` on the table `Mesa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `columna` to the `Mesa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fila` to the `Mesa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Mesa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mesa` ADD COLUMN `columna` INTEGER NOT NULL,
    ADD COLUMN `fila` INTEGER NOT NULL,
    ADD COLUMN `numero` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Mesa_sucursalId_numero_key` ON `Mesa`(`sucursalId`, `numero`);

-- CreateIndex
CREATE UNIQUE INDEX `Mesa_sucursalId_fila_columna_key` ON `Mesa`(`sucursalId`, `fila`, `columna`);
