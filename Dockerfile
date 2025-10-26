FROM node:22-alpine

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install
COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]