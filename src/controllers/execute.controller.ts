
import express, { Request, Response } from 'express';
export async function executeTask(req: Request, res: Response): Promise<any> {
  try {
    console.log(`🌍 Incoming request: ${JSON.stringify(req.body)}`);

    const { taskId, userId, action } = req.body;

    if (!taskId || !userId || !action) {
      console.error(`❌ Invalid payload: ${JSON.stringify(req.body)}`);
      return res.status(400).json({ error: 'Invalid payload' });
    }

    console.log(`✅ Executing task for user: ${userId}, action: ${action}`);

    // Simulate task execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.status(200).json({ message: 'Task executed successfully' });
  } catch (error: any) {
    console.error(`❌ Error executing task: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}
