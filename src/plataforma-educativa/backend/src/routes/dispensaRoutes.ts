import { Router } from 'express';
import { dispensaController } from '../controllers/DispensaController';

const router = Router();

// POST /api/dispensas
router.post('/', dispensaController.createDispensa);

// PATCH /api/dispensas/:id/status
router.patch('/:id/status', dispensaController.updateStatus);

// GET /api/dispensas (Para administración)
router.get('/', dispensaController.getAllDispensas);

export default router;
