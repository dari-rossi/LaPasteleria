-- CreateTable
CREATE TABLE `Mesa` (
    `idMesa` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` ENUM('Libre', 'Ocupada', 'Reservada') NOT NULL,
    `maxComensales` INTEGER NOT NULL,

    PRIMARY KEY (`idMesa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
