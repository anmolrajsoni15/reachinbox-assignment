## Reachinbox assignment

In this assignment I developed a server with nodejs and typescript.

### Run the app


1. Clone the repository
    ```
    git clone https://github.com/anmolrajsoni15/reachinbox-assignment.git
    cd reachinbox-assignment
    ```

2. install dependencies

    ```
    npm i
    ```
3. add .env

    ```
    PORT = 2000
    GOOGLE_CLIENT_ID = ***
    GOOGLE_CLIENT_SECRET = ***
    GOOGLE_REDIRECT_URI = ***
    OPENAI_SECRECT_KEY = ***
    REDIS_PORT = ***
    REDIS_PASSWORD = ***
    REDIS_HOST = ***
    ```

4. In you google cloud console, turn on the gmail apis, and created an oauth service where you need to paste the GOOGLE_REDIRECT_URI. which will be http://localhost:PORT/auth/google/callback


5. Run the server

    ```
    npm run dev
    ```
6. Now just go to http://localhost:2000 in your browser to acess it.

## Folder Structure

```
src/
├── config/
│   └── redis.conf.ts       # Redis configuration settings
├── constants/
│   └── constants.ts        # Project-wide constants and enums
├── models/
│   ├── email.data.model.ts # Email data type definitions
│   └── google.model.ts     # Google service related interfaces
├── services/
│   ├── gmail.service.ts    # Gmail API integration service
│   └── google.oauth.service.ts # Google OAuth authentication service
└── utils/
    ├── utils.ts           # Utility functions
    ├── index.ts          # Main entry point
    └── worker.ts         # Background worker functionality
```



