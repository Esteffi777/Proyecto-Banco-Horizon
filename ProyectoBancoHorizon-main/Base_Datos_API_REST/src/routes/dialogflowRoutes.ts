import { Router } from 'express';
import { webhook } from '../controllers/dialogflowController';

const router = Router();

router.post('/webhook', webhook);

export default router;
