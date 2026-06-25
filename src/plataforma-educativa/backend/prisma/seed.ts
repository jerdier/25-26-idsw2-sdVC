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

  const admin = await prisma.administrador.create({
    data: { id: 'testadmin1-id', nombre: 'testadmin1', email: 'testadmin1@cgu.es', password: 'password1' }
  });

  const secretaria = await prisma.secretariaAcademica.create({
    data: { id: 'testsecretaria1-id', nombre: 'testsecretaria1', email: 'testsecretaria1@cgu.es', password: 'password1' }
  });

  const profesor = await prisma.profesor.create({
    data: { id: 'testprofesor1-id', nombre: 'testprofesor1', email: 'testprofesor1@cgu.es', password: 'password1' }
  });

  const director = await prisma.directorDeGrado.create({
    data: { id: 'testdirector1-id', nombre: 'testdirector1', email: 'testdirector1@cgu.es', password: 'password1' }
  });

  const grado = await prisma.grado.create({
    data: { id: 'grado1-id', nombre: 'Ingeniería del Software', directorId: director.id }
  });

  const alumno = await prisma.alumno.create({
    data: {
      id: 'testalumno1-id',
      nombre: 'testalumno1',
      numeroRegistro: 'ALU001',
      dni: '00000001A',
      email: 'testalumno1@cgu.es',
      password: 'password1'
    }
  });

  const asignatura = await prisma.asignatura.create({
    data: {
      id: 'asignatura1-id',
      nombre: 'Ingeniería del Software II',
      gradoId: grado.id,
      profesorId: profesor.id,
      alumnos: { connect: [{ id: alumno.id }] }
    }
  });

  await prisma.matricula.create({
    data: { alumnoId: alumno.id, gradoId: grado.id, secretariaId: secretaria.id }
  });

  const sesion = await prisma.sesionDeClase.create({
    data: { id: 'sesion1-id', asignaturaId: asignatura.id, fecha: new Date(), aula: 'Aula A1', duracion: 90 }
  });

  await prisma.asistencia.create({
    data: { sesionId: sesion.id, alumnoId: alumno.id, profesorId: profesor.id, presente: true }
  });

  console.log('--- Sembrado Completado ---');
  console.log('testalumno1@cgu.es / password1');
  console.log('testprofesor1@cgu.es / password1');
  console.log('testdirector1@cgu.es / password1');
  console.log('testsecretaria1@cgu.es / password1');
  console.log('testadmin1@cgu.es / password1');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
