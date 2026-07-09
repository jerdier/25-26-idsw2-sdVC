import api from './api';

export const secretariaService = {
  // CU: abrirAlumnos
  async consultarListaAlumnos(filtro?: string) {
    return (await api.get('/secretaria/alumnos', { params: filtro ? { filtro } : undefined })).data;
  },

  // CU: consultarAlumno
  async consultarAlumno(alumnoId: string) {
    return (await api.get(`/secretaria/alumnos/${alumnoId}`)).data;
  },

  // CU: abrirMatriculas
  async abrirMatriculas(filtro?: string) {
    return (await api.get('/secretaria/matriculas', { params: filtro ? { filtro } : undefined })).data;
  },

  // CU: cerrarCicloAcademico
  async cerrarCicloAcademico() {
    return (await api.post('/secretaria/ciclos/cerrar')).data;
  },

  // CU: consultarDetalleMatricula
  async consultarDetalleMatricula(alumnoId: string) {
    return (await api.get(`/secretaria/alumnos/${alumnoId}/matriculas`)).data;
  },

  // CU: importarAlumnos
  async importarListasAlumnos(data: { alumnos: { nombre: string; email: string; dni: string }[] }) {
    return (await api.post('/secretaria/import/alumnos', data)).data;
  },

  // CU: importarMatriculas
  async importarMatriculas(data: { matriculas: { dni: string; asignaturaId: string }[]; secretariaId: string; gradoId: string }) {
    return (await api.post('/secretaria/import/matriculas', data)).data;
  }
};

export default secretariaService;
