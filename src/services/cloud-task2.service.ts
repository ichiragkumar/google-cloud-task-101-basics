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
    },
  };

  const [response] = await client.createTask(task);

  console.log(`✅ Task created: ${response.name} and ${response.scheduleTime} scheduled with taskId: ${taskId}`);




}



async function createMultipleTasks() {
  for (let i = 0; i < 1000; i++) {
    try {
      await createCloudTask(`user-${i}`, `action-${i}`, 60);
      console.log(`🚀 Created task ${i + 1} of 1000`);
      await new Promise((resolve) => setTimeout(resolve, 50));
    } catch (error: any) {
      console.error(`❌ Failed to create task ${i + 1}: ${error.message}`);
    }
  }
}

createMultipleTasks()
  .then(() => console.log('✅ All tasks created'))
  .catch((error) => console.error(`❌ Error creating tasks: ${error.message}`));