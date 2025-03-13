import { Request, Response } from 'express';

export async function executeTask(req: Request, res: Response) {
  try {
    const { userId, action } = req.body;

    console.log(`✅ Executing task for user: ${userId}, action: ${action}`);


    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.status(200).json({ message: 'Task executed successfully' });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}
