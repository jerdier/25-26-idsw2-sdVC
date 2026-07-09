require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  try {
    const alumnos = await prisma.alumno.findMany({ include: { asignaturas: true } });
    console.log(alumnos);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    pool.end();
  }
}
run();
