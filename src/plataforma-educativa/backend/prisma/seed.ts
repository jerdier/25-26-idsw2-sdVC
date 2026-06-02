import { PrismaClient, EstadoDispensa } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Iniciando sembrado de datos (Seeding) ---');

  // 1. Limpiar datos previos
  await prisma.asistencia.deleteMany({});
  await prisma.dispensa.deleteMany({});
  await prisma.sesionDeClase.deleteMany({});
  await prisma.matricula.deleteMany({});
  await prisma.asignatura.deleteMany({});
  await prisma.grado.deleteMany({});
  await prisma.alumno.deleteMany({});
  await prisma.directorDeGrado.deleteMany({});
  await prisma.profesor.deleteMany({});
  await prisma.secretariaAcademica.deleteMany({});

  // 2. Crear Profesores
  const prof1 = await prisma.profesor.create({
    data: {
      id: 'mock-profesor-id', // Forzamos el ID que usamos en el frontend para la prueba
      nombre: 'Dr. Javier Pérez',
      email: 'javier.perez@universidad.edu',
    },
  });

  const prof2 = await prisma.profesor.create({
    data: {
      nombre: 'Dra. María García',
      email: 'maria.garcia@universidad.edu',
    },
  });

  // 3. Crear Director de Grado
  const director = await prisma.directorDeGrado.create({
    data: {
      profesorId: prof2.id,
    },
  });

  // 4. Crear Grado
  const grado = await prisma.grado.create({
    data: {
      nombre: 'Ingeniería de Software',
      directorId: director.id,
    },
  });

  // 5. Crear Alumnos
  const alumnos = await Promise.all([
    prisma.alumno.create({ data: { nombre: 'Juan Manuel Ortiz', numeroRegistro: 'ALU001', email: 'juan@mail.com' } }),
    prisma.alumno.create({ data: { nombre: 'Elena Rodríguez', numeroRegistro: 'ALU002', email: 'elena@mail.com' } }),
    prisma.alumno.create({ data: { nombre: 'Carlos Ruiz', numeroRegistro: 'ALU003', email: 'carlos@mail.com' } }),
  ]);

  // 6. Crear Asignaturas
  const asig1 = await prisma.asignatura.create({
    data: {
      nombre: 'Diseño de Sistemas II',
      gradoId: grado.id,
      profesorId: prof1.id,
      alumnos: {
        connect: alumnos.map((a: any) => ({ id: a.id })),
      },
    },
  });

  const asig2 = await prisma.asignatura.create({
    data: {
      nombre: 'Arquitectura de Software',
      gradoId: grado.id,
      profesorId: prof1.id,
      alumnos: {
        connect: alumnos.map((a: any) => ({ id: a.id })),
      },
    },
  });

  // 7. Crear Matrículas (Necesarias para que el AcademicService encuentre a los alumnos)
  const secretaria = await prisma.secretariaAcademica.create({
    data: {
      nombre: 'Secretaría Central',
      email: 'secretaria@universidad.edu',
    },
  });

  for (const alumno of alumnos) {
    await prisma.matricula.create({
      data: {
        alumnoId: alumno.id,
        gradoId: grado.id,
        secretariaId: secretaria.id,
      },
    });
  }

  console.log('--- Sembrado completado con éxito ---');
  console.log(`Profesor ID para prueba: ${prof1.id}`);
  console.log(`Asignaturas creadas: ${asig1.nombre}, ${asig2.nombre}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
