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
