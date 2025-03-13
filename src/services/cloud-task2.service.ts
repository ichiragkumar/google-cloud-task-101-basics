import { CloudTasksClient } from '@google-cloud/tasks';
import { v4 as uuid } from 'uuid';

const client = new CloudTasksClient();

const project = process.env.GOOGLE_PROJECT_ID!;
const location = process.env.GOOGLE_LOCATION!;
const queue = process.env.GOOGLE_QUEUE_NAME!;
const handlerUrl = process.env.HANDLER_URL!;
const serviceAccountEmail = process.env.SERVICE_ACCOUNT_EMAIL!;

const queuePath = client.queuePath(project, location, queue);

export async function createCloudTask(userId: string, action: string, scheduleTimeSeconds?: number) {
  const taskId = `${uuid()}`;
  const url = `${handlerUrl}`;
  const parent = queuePath;

  const message = {
    taskId,
    payload: {
      userId,
      action,
    },
  };

  const task = {
    parent,
    task: {
      name: `${parent}/tasks/${taskId}`,
      httpRequest: {
        httpMethod: 'POST',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        oidcToken: {
          serviceAccountEmail,
        },
        body: Buffer.from(JSON.stringify(message)).toString('base64'),
      },
      scheduleTime: scheduleTimeSeconds
        ? { seconds: Math.floor(Date.now() / 1000) + scheduleTimeSeconds }
        : undefined,
    },
  };

  const [response] = await client.createTask(task);

  console.log(`✅ Task created: ${response.name}`);
}
