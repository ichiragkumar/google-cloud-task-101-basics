import { createCloudTask } from '../services/cloud-task2.service';

import { Request, Response } from 'express';


export async function createTask(req: Request, res: Response) {
  try {
    const { userId, action, delayInSeconds } = req.body;

    await createCloudTask(
      userId,
      action,
      delayInSeconds ? Date.now() / 1000 + delayInSeconds : undefined
    );

    res.status(200).json({ message: 'Task created successfully' });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}


