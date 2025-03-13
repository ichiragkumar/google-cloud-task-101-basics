import { Router } from 'express';
import { handleTask } from '../controllers/task.controller';


const router = Router();

router.post('/create', handleTask);

export default router;


