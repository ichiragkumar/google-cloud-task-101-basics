// Create a file src/types/google-cloud-tasks.d.ts
declare module '@google-cloud/tasks' {
    export class CloudTasksClient {
      constructor();
      // Add methods as needed
      queuePath(project: string, location: string, queue: string): string;
      createTask(request: any): Promise<any>;
    }
  }