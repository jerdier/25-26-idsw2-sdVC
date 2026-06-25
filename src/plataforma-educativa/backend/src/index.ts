import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import attendanceRoutes from './routes/attendanceRoutes';
import dispensaRoutes from './routes/dispensaRoutes';
import academicRoutes from './routes/academicRoutes';
import secretariaRoutes from './routes/secretariaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/attendance', attendanceRoutes);
app.use('/api/dispensas', dispensaRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/secretaria', secretariaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API CGU funcionando');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
