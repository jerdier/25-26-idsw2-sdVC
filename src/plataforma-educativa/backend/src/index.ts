import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Placeholder route for Alumnos (Fase 3: Diseño de API)
app.get('/api/alumnos', async (req, res) => {
  try {
    const alumnos = await prisma.alumno.findMany();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});

app.get('/', (req, res) => {
  res.send('API de CGU funcionando (Fase 3)');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
