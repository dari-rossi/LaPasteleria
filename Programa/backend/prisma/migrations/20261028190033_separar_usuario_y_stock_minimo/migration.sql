/*
  Warnings:

  - The primary key for the `tipoempleado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contrasenia` on the `tipoempleado` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `tipoempleado` table. All the data in the column will be lost.
  - You are about to drop the column `tipoEmpleado` on the `tipoempleado` table. All the data in the column will be lost.
  - You are about to drop the column `usuario` on the `tipoempleado` table. All the data in the column will be lost.
  - You are about to drop the `cuentaacceso` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[rol]` on the table `TipoEmpleado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stockMinimo` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idTipoEmpleado` to the `TipoEmpleado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol` to the `TipoEmpleado` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cuentaacceso` DROP FOREIGN KEY `CuentaAcceso_sucursalId_fkey`;

-- DropForeignKey
ALTER TABLE `sucursaltipoempleado` DROP FOREIGN KEY `SucursalTipoEmpleado_tipoEmpleadoId_fkey`;

-- DropIndex
DROP INDEX `SucursalTipoEmpleado_tipoEmpleadoId_fkey` ON `sucursaltipoempleado`;

-- DropIndex
DROP INDEX `TipoEmpleado_tipoEmpleado_key` ON `tipoempleado`;

-- DropIndex
DROP INDEX `TipoEmpleado_usuario_key` ON `tipoempleado`;

-- AlterTable
ALTER TABLE `tipoempleado` DROP PRIMARY KEY,
    DROP COLUMN `contrasenia`,
    DROP COLUMN `id`,
    DROP COLUMN `tipoEmpleado`,
    DROP COLUMN `usuario`,
    ADD COLUMN `idTipoEmpleado` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `rol` ENUM('DUENIO', 'GERENTE', 'MOZO', 'AYUDANTE_COCINA') NOT NULL,
    ADD PRIMARY KEY (`idTipoEmpleado`);

-- DropTable
DROP TABLE `cuentaacceso`;

-- CreateTable
CREATE TABLE `Usuario` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombreUsuario` VARCHAR(191) NOT NULL,
    `contrasenia` VARCHAR(191) NOT NULL,
    `idTipoEmpleado` INTEGER NOT NULL,
    `sucursalId` INTEGER NULL,

    UNIQUE INDEX `Usuario_nombreUsuario_key`(`nombreUsuario`),
    UNIQUE INDEX `Usuario_idTipoEmpleado_sucursalId_key`(`idTipoEmpleado`, `sucursalId`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `TipoEmpleado_rol_key` ON `TipoEmpleado`(`rol`);

-- AddForeignKey
ALTER TABLE `SucursalTipoEmpleado` ADD CONSTRAINT `SucursalTipoEmpleado_tipoEmpleadoId_fkey` FOREIGN KEY (`tipoEmpleadoId`) REFERENCES `TipoEmpleado`(`idTipoEmpleado`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_idTipoEmpleado_fkey` FOREIGN KEY (`idTipoEmpleado`) REFERENCES `TipoEmpleado`(`idTipoEmpleado`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `Sucursal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
