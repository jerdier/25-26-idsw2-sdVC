import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not defined');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Iniciando Sembrado ---');

  // Limpieza total
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
  await prisma.administrador.deleteMany({});

  // 1. Administrador Genuino
  await prisma.administrador.create({
    data: {
      id: 'admin-global-id',
      nombre: 'ADMINISTRADOR',
      email: 'admin@universidad.edu',
      password: 'admin123',
    },
  });

  // 2. Secretaría
  const secretaria = await prisma.secretariaAcademica.create({
    data: {
      id: 'test-secretaria-id',
      nombre: 'TEST SECRETARIA',
      email: 'test.secretaria1@universidad.edu',
      password: 'password123',
    },
  });

  // 3. Profesores
  const prof1 = await prisma.profesor.create({
    data: {
      id: 'test-profesor-id',
      nombre: 'TEST PROFESOR 1',
      email: 'test.profesor1@universidad.edu',
      password: 'password123',
    },
  });

  const prof2 = await prisma.profesor.create({
    data: {
      nombre: 'TEST PROFESOR 2',
      email: 'test.profesor2@universidad.edu',
      password: 'password123',
    },
  });

  // 4. Director de Grado
  const director = await prisma.directorDeGrado.create({
    data: { 
      id: 'test-director-id',
      nombre: 'TEST DIRECTOR',
      email: 'test.director1@universidad.edu',
      password: 'password123'
    },
  });

  // 5. Grado
  const grado = await prisma.grado.create({
    data: { nombre: 'TEST GRADO SOFTWARE', directorId: director.id },
  });

  // 6. Alumnos
  const alumno1 = await prisma.alumno.create({
    data: { nombre: 'TEST ALUMNO 1', numeroRegistro: 'ALU001', email: 'test.alumno1@mail.com', password: 'password123' }
  });

  // 7. Asignaturas
  await prisma.asignatura.create({
    data: {
      nombre: 'TEST ASIGNATURA A',
      gradoId: grado.id,
      profesorId: prof1.id,
      alumnos: { connect: [{ id: alumno1.id }] },
    },
  });

  // 8. Matrículas
  await prisma.matricula.create({ data: { alumnoId: alumno1.id, gradoId: grado.id, secretariaId: secretaria.id } });

  console.log('--- Sembrado Completado ---');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
