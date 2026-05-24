-- CreateEnum
CREATE TYPE "EstadoDispensa" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "SecretariaAcademica" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "SecretariaAcademica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectorDeGrado" (
    "id" TEXT NOT NULL,
    "profesorId" TEXT NOT NULL,

    CONSTRAINT "DirectorDeGrado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" TEXT NOT NULL,
    "numeroRegistro" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grado" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "directorId" TEXT,
    "secretariaId" TEXT,

    CONSTRAINT "Grado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignatura" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "gradoId" TEXT NOT NULL,
    "profesorId" TEXT NOT NULL,

    CONSTRAINT "Asignatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matricula" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alumnoId" TEXT NOT NULL,
    "gradoId" TEXT NOT NULL,
    "secretariaId" TEXT NOT NULL,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SesionDeClase" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "asignaturaId" TEXT NOT NULL,

    CONSTRAINT "SesionDeClase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT false,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sesionId" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "profesorId" TEXT NOT NULL,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispensa" (
    "id" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoDispensa" NOT NULL DEFAULT 'PENDIENTE',
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alumnoId" TEXT NOT NULL,
    "secretariaId" TEXT NOT NULL,
    "directorId" TEXT,

    CONSTRAINT "Dispensa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlumnoToAsignatura" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlumnoToAsignatura_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DispensaToSesionDeClase" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DispensaToSesionDeClase_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecretariaAcademica_email_key" ON "SecretariaAcademica"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profesor_email_key" ON "Profesor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DirectorDeGrado_profesorId_key" ON "DirectorDeGrado"("profesorId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_numeroRegistro_key" ON "Alumno"("numeroRegistro");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_email_key" ON "Alumno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_sesionId_alumnoId_key" ON "Asistencia"("sesionId", "alumnoId");

-- CreateIndex
CREATE INDEX "_AlumnoToAsignatura_B_index" ON "_AlumnoToAsignatura"("B");

-- CreateIndex
CREATE INDEX "_DispensaToSesionDeClase_B_index" ON "_DispensaToSesionDeClase"("B");

-- AddForeignKey
ALTER TABLE "DirectorDeGrado" ADD CONSTRAINT "DirectorDeGrado_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grado" ADD CONSTRAINT "Grado_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "DirectorDeGrado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grado" ADD CONSTRAINT "Grado_secretariaId_fkey" FOREIGN KEY ("secretariaId") REFERENCES "SecretariaAcademica"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignatura" ADD CONSTRAINT "Asignatura_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignatura" ADD CONSTRAINT "Asignatura_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_gradoId_fkey" FOREIGN KEY ("gradoId") REFERENCES "Grado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_secretariaId_fkey" FOREIGN KEY ("secretariaId") REFERENCES "SecretariaAcademica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SesionDeClase" ADD CONSTRAINT "SesionDeClase_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES "Asignatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "SesionDeClase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispensa" ADD CONSTRAINT "Dispensa_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispensa" ADD CONSTRAINT "Dispensa_secretariaId_fkey" FOREIGN KEY ("secretariaId") REFERENCES "SecretariaAcademica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispensa" ADD CONSTRAINT "Dispensa_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "DirectorDeGrado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlumnoToAsignatura" ADD CONSTRAINT "_AlumnoToAsignatura_A_fkey" FOREIGN KEY ("A") REFERENCES "Alumno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlumnoToAsignatura" ADD CONSTRAINT "_AlumnoToAsignatura_B_fkey" FOREIGN KEY ("B") REFERENCES "Asignatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DispensaToSesionDeClase" ADD CONSTRAINT "_DispensaToSesionDeClase_A_fkey" FOREIGN KEY ("A") REFERENCES "Dispensa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DispensaToSesionDeClase" ADD CONSTRAINT "_DispensaToSesionDeClase_B_fkey" FOREIGN KEY ("B") REFERENCES "SesionDeClase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
