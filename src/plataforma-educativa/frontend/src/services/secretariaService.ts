import api from './api';

export const secretariaService = {
  // CU: consultarListaAlumnos / consultarDetalleAlumno
  async consultarListaAlumnos() {
    return (await api.get('/secretaria/alumnos')).data;
  },

  // CU: consultarDetalleMatricula
  async consultarDetalleMatricula(alumnoId: string) {
    return (await api.get(`/secretaria/alumnos/${alumnoId}/matriculas`)).data;
  },

  // CU: importarListasAlumnos
  async importarListasAlumnos(data: { alumnos: { nombre: string; email: string; dni: string }[] }) {
    return (await api.post('/secretaria/import/alumnos', data)).data;
  },

  // CU: importarMatriculas
  async importarMatriculas(data: { matriculas: { dni: string; asignaturaId: string }[]; secretariaId: string; gradoId: string }) {
    return (await api.post('/secretaria/import/matriculas', data)).data;
  }
};

export default secretariaService;
