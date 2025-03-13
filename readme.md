


npm init -y


npx tsc --init


{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}



add These libraies


npm install 
        1. express 
        2. @google-cloud/tasks 
        3. dotenv

npm install 
    1. --save-dev 
    2. typescript 
    3. ts-node 
    4. nodemon 
    5. @types/express


npm install express @google-cloud/tasks dotenv
npm install --save-dev typescript ts-node nodemon @types/express


your .env.example

PORT=4000
GOOGLE_PROJECT_ID=your-google-cloud-project-id
GOOGLE_LOCATION=your-region
GOOGLE_QUEUE_NAME=your-queue-name
HANDLER_URL=https://your-domain.com/handle-task



// follow any strucute

and get some route ready

        1. Enable Cloud Tasks API
        2. Create a Service Account
            Go to IAM & Admin → Service Accounts
            Create a service account with the role Cloud Tasks Admin
            Download the key file (JSON)



// now update your .env

GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
