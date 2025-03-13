import { Router } from 'express';
import { createTask } from '../controllers/task.controller';
import { verifyAuth } from '../middlewares/auth.middleware';
import { executeTask } from '../controllers/execute.controller';


const router = Router();





router.post('/create-task', createTask);
router.post('/execute-task', executeTask);

// router.post('/execute-task', verifyAuth, executeTask);

export default router;


