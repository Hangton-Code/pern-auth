# Stage1: Client UI Build
FROM node:18 AS client-build
WORKDIR /frontend
COPY /frontend .
ENV REACT_APP_SERVER_URL=/api
RUN npm install --legacy-peer-deps && npm run build

# Stage2: Server API Build
FROM node:18
WORKDIR /app
COPY /backend .
RUN npm install && npm i bcrypt --unsafe-perm=true --allow-root --save
COPY --from=client-build /frontend/build ./client
EXPOSE 5000

CMD ["npm", "run", "start"]

# build by "docker build -t pern-auth-app:<version> ."