import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const alumnos = await prisma.alumno.findMany();
  const profesores = await prisma.profesor.findMany();
  console.log('--- ALUMNOS ---');
  console.log(alumnos.map(a => a.email));
  console.log('--- PROFESORES ---');
  console.log(profesores.map(p => p.email));
  await prisma.$disconnect();
}

check();
