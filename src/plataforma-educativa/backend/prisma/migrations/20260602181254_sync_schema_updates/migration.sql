/*
  Warnings:

  - Added the required column `updatedAt` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Asignatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DirectorDeGrado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Dispensa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Grado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Profesor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SecretariaAcademica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SesionDeClase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Asignatura" DROP CONSTRAINT "Asignatura_gradoId_fkey";

-- DropForeignKey
ALTER TABLE "Asistencia" DROP CONSTRAINT "Asistencia_alumnoId_fkey";

-- DropForeignKey
ALTER TABLE "Dispensa" DROP CONSTRAINT "Dispensa_alumnoId_fkey";

-- DropForeignKey
ALTER TABLE "Matricula" DROP CONSTRAINT "Matricula_alumnoId_fkey";

-- DropForeignKey
ALTER TABLE "Matricula" DROP CONSTRAINT "Matricula_gradoId_fkey";

-- DropForeignKey
ALTER TABLE "SesionDeClase" DROP CONSTRAINT "SesionDeClase_asignaturaId_fkey";

-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Asignatura" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DirectorDeGrado" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Dispensa" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Grado" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Profesor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SecretariaAcademica" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SesionDeClase" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Asignatura" ADD CONSTRAINT "Asignatura_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SesionDeClase" ADD CONSTRAINT "SesionDeClase_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES "Asignatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispensa" ADD CONSTRAINT "Dispensa_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
