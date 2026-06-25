import { Router } from 'express';
import { secretariaController } from '../controllers/SecretariaController';

const router = Router();

// CU: consultarListaAlumnos / consultarDetalleAlumno
router.get('/alumnos', secretariaController.consultarListaAlumnos);

// CU: consultarDetalleMatricula
router.get('/alumnos/:alumnoId/matriculas', secretariaController.consultarDetalleMatricula);

// CU: importarListasAlumnos
router.post('/import/alumnos', secretariaController.importarListasAlumnos);

// CU: importarMatriculas
router.post('/import/matriculas', secretariaController.importarMatriculas);

export default router;
