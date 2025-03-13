import { Request, Response } from 'express';

export async function executeTask(req: Request, res: Response) {
  try {
    const { taskId, userId, action } = req.body;

    if (!taskId || !userId || !action) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    console.log(`✅ Executing task for user: ${userId}, action: ${action}`);


    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.status(200).json({ message: 'Task executed successfully' });
  } catch (error: any) {
    console.error(`❌ Error executing task: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}
