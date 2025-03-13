import { CloudTasksClient } from '@google-cloud/tasks';
import { v4 as uuid } from 'uuid';

const client = new CloudTasksClient();

const project = process.env.GOOGLE_PROJECT_ID!;
const location = process.env.GOOGLE_LOCATION!;
const queue = process.env.GOOGLE_QUEUE_NAME!;
const handlerUrl = process.env.HANDLER_URL!;
const serviceAccountEmail = process.env.SERVICE_ACCOUNT_EMAIL!;

const queuePath = client.queuePath(project, location, queue);

export async function createCloudTask(payload: any, scheduleTimeSeconds?: number) {
  const taskId = `${uuid()}`;
  const url = `${handlerUrl}?taskId=${taskId}`;
  const parent = queuePath;

  const message = {
    taskId,
    payload,
  };

  const [response] = await client.createTask({
    parent: queuePath,
    task: {
        name: `${parent}/tasks/${Date.now()}`,
        httpRequest: {
          oidcToken: {
                serviceAccountEmail,
          },
          headers: {
            'Content-Type': 'application/json',
          },
          httpMethod: 'POST',
          url: url,
          body: Buffer.from(JSON.stringify(message)).toString('base64'),
        },
        scheduleTime: scheduleTimeSeconds
        ? { seconds: scheduleTimeSeconds }
        : undefined,
      },
  });

  console.log(`✅ Task created: ${response.name}`);
}
