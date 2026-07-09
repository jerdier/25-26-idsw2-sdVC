import { Router } from 'express';
import { secretariaController } from '../controllers/SecretariaController';

const router = Router();

// CU: abrirAlumnos (con ?filtro= opcional)
router.get('/alumnos', secretariaController.consultarListaAlumnos);
// CU: consultarAlumno
router.get('/alumnos/:alumnoId', secretariaController.consultarAlumno);
// CU: consultarDetalleMatricula
router.get('/alumnos/:alumnoId/matriculas', secretariaController.consultarDetalleMatricula);
// CU: abrirMatriculas (con ?filtro= opcional)
router.get('/matriculas', secretariaController.abrirMatriculas);
// CU: cerrarCicloAcademico
router.post('/ciclos/cerrar', secretariaController.cerrarCicloAcademico);
// CU: importarAlumnos
router.post('/import/alumnos', secretariaController.importarListasAlumnos);
// CU: importarMatriculas
router.post('/import/matriculas', secretariaController.importarMatriculas);

export default router;
