import api from './api';
import type { 
  Alumno, 
  Profesor, 
  SecretariaStats, 
  CreateAlumnoDTO, 
  CreateProfesorDTO, 
  CreateMatriculaDTO 
} from '../types';

export class SecretariaService {
  async getStats(): Promise<SecretariaStats> {
    const response = await api.get<SecretariaStats>('/secretaria/stats');
    return response.data;
  }

  async getAlumnos(): Promise<Alumno[]> {
    const response = await api.get<Alumno[]>('/secretaria/alumnos');
    return response.data;
  }

  async createAlumno(data: CreateAlumnoDTO): Promise<Alumno> {
    const response = await api.post<Alumno>('/secretaria/alumnos', data);
    return response.data;
  }

  async getProfesores(): Promise<Profesor[]> {
    const response = await api.get<Profesor[]>('/secretaria/profesores');
    return response.data;
  }

  async createProfesor(data: CreateProfesorDTO): Promise<Profesor> {
    const response = await api.post<Profesor>('/secretaria/profesores', data);
    return response.data;
  }

  async getDirectores(): Promise<any[]> {
    const response = await api.get<any[]>('/secretaria/directores');
    return response.data;
  }

  async createDirector(data: any): Promise<any> {
    const response = await api.post<any>('/secretaria/directores', data);
    return response.data;
  }

  async getSecretarias(): Promise<any[]> {
    const response = await api.get<any[]>('/secretaria/secretarias');
    return response.data;
  }

  async createSecretaria(data: any): Promise<any> {
    const response = await api.post<any>('/secretaria/secretarias', data);
    return response.data;
  }

  async createMatricula(data: CreateMatriculaDTO): Promise<any> {
    const response = await api.post('/secretaria/matriculas', data);
    return response.data;
  }

  async importAlumnos(data: { alumnos: CreateAlumnoDTO[], gradoId: string, secretariaId: string }): Promise<any> {
    const response = await api.post('/secretaria/import/alumnos', data);
    return response.data;
  }
}

export const secretariaService = new SecretariaService();
