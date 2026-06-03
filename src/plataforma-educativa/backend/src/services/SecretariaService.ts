import prisma from '../lib/prisma';
import { 
  CreateAlumnoDTO, 
  CreateProfesorDTO, 
  CreateGradoDTO, 
  CreateAsignaturaDTO, 
  CreateMatriculaDTO 
} from '../types';

export class SecretariaService {
  // --- Gestión de Alumnos ---
  async createAlumno(data: CreateAlumnoDTO) {
    return await prisma.alumno.create({ data });
  }

  async getAllAlumnos() {
    return await prisma.alumno.findMany({
      include: {
        matriculas: {
          include: { grado: true }
        }
      }
    });
  }

  // --- Gestión de Profesores ---
  async createProfesor(data: CreateProfesorDTO) {
    return await prisma.profesor.create({ data });
  }

  async getAllProfesores() {
    return await prisma.profesor.findMany();
  }

  // --- Gestión Académica ---
  async createGrado(data: CreateGradoDTO) {
    return await prisma.grado.create({ data });
  }

  async getAllGrados() {
    return await prisma.grado.findMany({
      include: { director: { include: { profesor: true } } }
    });
  }

  async createAsignatura(data: CreateAsignaturaDTO) {
    return await prisma.asignatura.create({ data });
  }

  async createMatricula(data: CreateMatriculaDTO) {
    return await prisma.matricula.create({ data });
  }

  // --- Consultas Consolidadas ---
  async getDashboardStats() {
    const [alumnos, profesores, grados, dispensas] = await Promise.all([
      prisma.alumno.count(),
      prisma.profesor.count(),
      prisma.grado.count(),
      prisma.dispensa.count({ where: { estado: 'PENDIENTE' } })
    ]);

    return { alumnos, profesores, grados, dispensasPendientes: dispensas };
  }
}

export const secretariaService = new SecretariaService();
