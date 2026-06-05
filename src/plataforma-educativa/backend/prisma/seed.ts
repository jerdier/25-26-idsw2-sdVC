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
      id: 'mock-profesor-id',
      nombre: 'Test Docente 1',
      email: 'test.docente1@universidad.edu',
      password: 'password123',
    },
  });

  const prof2 = await prisma.profesor.create({
    data: {
      id: 'mock-director-prof-id',
      nombre: 'Test Director 1',
      email: 'test.director1@universidad.edu',
      password: 'password123',
    },
  });

  // 3. Crear Director de Grado
  const director = await prisma.directorDeGrado.create({
    data: {
      id: 'mock-director-id',
      profesorId: prof2.id,
    },
  });

  // 4. Crear Grado
  const grado = await prisma.grado.create({
    data: {
      nombre: 'Grado de Prueba 1',
      directorId: director.id,
    },
  });

  // 5. Crear Alumnos
  const alumnos = await Promise.all([
    prisma.alumno.create({ data: { nombre: 'Test Alumno 1', numeroRegistro: 'ALU001', email: 'test.alumno1@mail.com', password: 'password123' } }),
    prisma.alumno.create({ data: { nombre: 'Test Alumno 2', numeroRegistro: 'ALU002', email: 'test.alumno2@mail.com', password: 'password123' } }),
    prisma.alumno.create({ data: { nombre: 'Test Alumno 3', numeroRegistro: 'ALU003', email: 'test.alumno3@mail.com', password: 'password123' } }),
  ]);

  // 6. Crear Asignaturas
  const asig1 = await prisma.asignatura.create({
    data: {
      nombre: 'Asignatura Test A',
      gradoId: grado.id,
      profesorId: prof1.id,
      alumnos: {
        connect: alumnos.map((a: any) => ({ id: a.id })),
      },
    },
  });

  // 7. Crear Matrículas
  const secretaria = await prisma.secretariaAcademica.create({
    data: {
      id: 'mock-secretaria-id',
      nombre: 'Test Secretaria 1',
      email: 'test.secretaria1@universidad.edu',
      password: 'password123',
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
  console.log(`Asignatura creada: ${asig1.nombre}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
