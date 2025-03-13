
import { CloudTasksClient } from "@google-cloud/tasks";
export class CloudTasksService {
  private client = new CloudTasksClient();

  async createTask(message: string) {
    const project = process.env.GOOGLE_PROJECT_ID!;
    const location = process.env.GOOGLE_LOCATION!;
    const queue = process.env.GOOGLE_QUEUE_NAME!;
    const url = process.env.HANDLER_URL!;
    
    const parent = this.client.queuePath(project, location, queue);

  
    const [response] = await this.client.createTask({
      parent: parent,
      task: {
        name: `${parent}/tasks/${Date.now()}`,
        httpRequest: {
          headers: {
            'Content-Type': 'application/json',
          },
          httpMethod: 'POST',
          url: url,
          body: Buffer.from(JSON.stringify(message)).toString('base64'),
        }
      },
    });

    console.log(`Task created: ${response.name}`);
  }
}
