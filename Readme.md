# Introduction

`PERN-AUTH` is a example web app that implements full authentication system based on PERN (PostgreSQL, Express, React, Node.js)

# Knowledge Involved

- [PostgreSQL](https://www.postgresql.org/)
- [Typescript](https://www.typescriptlang.org/)
- [ExpressJs](https://expressjs.com/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)

# On Development

**Read the following instruction carefully in order to make sure your app run as expected**

### System requirement

- Node.js
- tsc
- yarn (optional)

### Services Setup

- Run those [query command](/db-setup.sql) on your PostgreSQL Server to create a database and a table for storing users data
- AWS s3 bucket setup reference: https://www.youtube.com/watch?v=NZElg91l_ms&t=360s
- Google oauth setup reference: https://www.youtube.com/watch?v=Qt3KJZ2kQk0&t=1302s

### Required Environment Variable (`/backend/.env`)

```
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=pern-auth
JWT_TOKEN_SECRET_KEY=
JWT_ACCESS_TOKEN_SECRET_KEY=
JWT_REFRESH_TOKEN_SECRET_KEY=
AWS_S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5000/api/auth/google/redirect
NODEMAILER_OUTLOOK_EMAIL=
NODEMAILER_OUTLOOK_PASSWORD=
```

### Run

At least 3 terminal is needed
| | Usage | Command |
| - | - | - |
| 1 | Typescript Debugger | `tsc -w` |
| 2 | Server API | `cd backend && npm run dev` or `cd backend &&  yarn dev` |
| 3 | Client UI | `cd frontend && npm run start` or `cd frontend && yarn start` |

# On Production

### System Requirement

- Docker

### Docker

we will simply integrate the backend and frontend by the [Dockerfile](/Dockerfile) and run with the [docker-compose.yml](/docker-compose.yml)

1. build a docker image by `docker build -t pern-auth-app:1.0 .`
2. edit the environment variable on the [docker compose file](/docker-compose.yml) as your preferences
3. run the docker compose by `docker-compose up -d`

# The End

Thank you for reaching till here. 😊 \
Feel free to ask me if you have any question.
