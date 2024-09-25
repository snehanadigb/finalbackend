FROM node:alpine3.10
WORKDIR /app/
COPY . .
RUN npm install
CMD ["node","server.js"]

