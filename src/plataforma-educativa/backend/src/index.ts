import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import attendanceRoutes from './routes/attendanceRoutes';
import dispensaRoutes from './routes/dispensaRoutes';
import academicRoutes from './routes/academicRoutes';
import secretariaRoutes from './routes/secretariaRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- Rutas ---
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dispensas', dispensaRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/secretaria', secretariaRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API de CGU funcionando (Fase 3: Arquitectura Implementada)');
});

// --- Middleware de Manejo de Errores Global ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ha ocurrido un error inesperado en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
