import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import academicRoutes from './routes/academicRoutes';
import adminRoutes from './routes/adminRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import authRoutes from './routes/authRoutes';
import dispensaRoutes from './routes/dispensaRoutes';
import secretariaRoutes from './routes/secretariaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/academic', academicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dispensas', dispensaRoutes);
app.use('/api/secretaria', secretariaRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.send('API de CGU funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
