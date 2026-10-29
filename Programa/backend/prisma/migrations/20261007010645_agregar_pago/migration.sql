-- CreateTable
CREATE TABLE `Pago` (
    `idPedido` INTEGER NOT NULL,
    `fechaHora` DATETIME(3) NOT NULL,
    `precio` DOUBLE NOT NULL,
    `tipoDescuento` VARCHAR(191) NOT NULL,
    `metodoPago` VARCHAR(191) NOT NULL,
    `precioFinal` DOUBLE NOT NULL,

    PRIMARY KEY (`idPedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
