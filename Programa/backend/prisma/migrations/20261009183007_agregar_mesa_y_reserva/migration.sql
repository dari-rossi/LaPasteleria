-- CreateTable
CREATE TABLE `Reserva` (
    `idMesa` INTEGER NOT NULL,
    `fechaHoraReservada` DATETIME(3) NOT NULL,
    `cantComensales` INTEGER NOT NULL,
    `estadoReserva` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idMesa`, `fechaHoraReservada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_idMesa_fkey` FOREIGN KEY (`idMesa`) REFERENCES `Mesa`(`idMesa`) ON DELETE RESTRICT ON UPDATE CASCADE;
