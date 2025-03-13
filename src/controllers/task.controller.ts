import { createCloudTask } from '../services/cloud-task2.service';
import { CloudTasksService } from '../services/cloud-tasks.service';
import { Request, Response } from 'express';
const cloudTasksService = new CloudTasksService();

export const handleTask = async (req: Request, res: Response):Promise<any> => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  await cloudTasksService.createTask(message);

  res.status(200).json({ success: true, message: `Task scheduled for: ${message}` });
};


export async function createTask(req: Request, res: Response) {
  try {
    const { userId, action, delayInSeconds } = req.body;

    await createCloudTask(
      { userId, action },
      delayInSeconds ? Date.now() / 1000 + delayInSeconds : undefined
    );

    res.status(200).json({ message: 'Task created successfully' });
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
}


