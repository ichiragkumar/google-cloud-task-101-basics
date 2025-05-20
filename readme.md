## 1. Initialize your project

```bash
npm init -y
```

This creates a default `package.json` file.

---

## 2. Initialize TypeScript config

```bash
npx tsc --init
```

Then update your **`tsconfig.json`** like this:

```json
{
  "compilerOptions": {
    "target": "es6",                   // Use modern JavaScript features
    "module": "commonjs",              // CommonJS modules for Node.js
    "outDir": "./dist",                // Compiled files output folder
    "rootDir": "./src",                // Source code folder
    "strict": true,                   // Enable strict type checking
    "esModuleInterop": true           // Allow default import compatibility
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

---

## 3. Install dependencies

### Runtime dependencies

```bash
npm install express @google-cloud/tasks dotenv
```

* `express`: Web framework for Node.js
* `@google-cloud/tasks`: Official client for Google Cloud Tasks API
* `dotenv`: Loads environment variables from `.env` files

### Development dependencies

```bash
npm install --save-dev typescript ts-node nodemon @types/express
```

* `typescript`: TypeScript compiler
* `ts-node`: Run TypeScript files directly
* `nodemon`: Automatically restarts server on code changes
* `@types/express`: TypeScript typings for Express

---

## 4. Create your `.env.example` file

```env
PORT=4000

GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_LOCATION=your-region         # e.g. us-central1
GOOGLE_QUEUE_NAME=your-queue-name   # e.g. my-task-queue

HANDLER_URL=https://your-domain.com/handle-task
```

---

## 5. Setup Google Cloud

1. **Enable Cloud Tasks API** in your Google Cloud Console.

2. **Create a Service Account:**

   * Go to IAM & Admin → Service Accounts
   * Create a new Service Account with the role **Cloud Tasks Admin**
   * Download the JSON key file and save it in your project folder (e.g., `service-account.json`)

3. **Add your service account path in `.env`**

```env
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

---

## 6. Project folder structure (suggested)

```
your-project/
│
├── src/
│   ├── index.ts          # Entry point
│   ├── routes/
│   │   └── tasks.ts      # Task-related routes
│   └── controllers/
│       └── taskController.ts
│
├── .env.example
├── .env                 # Your actual env file, gitignored
├── service-account.json # Google Cloud service account key
├── package.json
├── tsconfig.json
└── nodemon.json         # Optional nodemon config
```

---

## 7. Example: Basic Express server with a Task route

**src/index.ts**

```ts
import express from 'express';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**src/routes/tasks.ts**

```ts
import { Router } from 'express';
import { createTask } from '../controllers/taskController';

const router = Router();

router.post('/create', createTask);

export default router;
```

**src/controllers/taskController.ts**

```ts
import { Request, Response } from 'express';
import { CloudTasksClient } from '@google-cloud/tasks';

const client = new CloudTasksClient();

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId, location, queueName, handlerUrl } = {
      projectId: process.env.GOOGLE_PROJECT_ID!,
      location: process.env.GOOGLE_LOCATION!,
      queueName: process.env.GOOGLE_QUEUE_NAME!,
      handlerUrl: process.env.HANDLER_URL!,
    };

    const parent = client.queuePath(projectId, location, queueName);

    const task = {
      httpRequest: {
        httpMethod: 'POST',
        url: handlerUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        body: Buffer.from(JSON.stringify(req.body)).toString('base64'),
      },
    };

    const request = { parent, task };

    const [response] = await client.createTask(request);
    res.status(201).json({ message: 'Task created', taskName: response.name });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};
```

---

## 8. Scripts for development and build (in `package.json`)

```json
"scripts": {
  "start": "node dist/index.js",
  "build": "tsc",
  "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"
}
```

* `npm run dev` — Runs your app in development mode with auto restart.
* `npm run build` — Compiles TypeScript to JavaScript in `/dist`.
* `npm start` — Runs compiled JavaScript app.

---

