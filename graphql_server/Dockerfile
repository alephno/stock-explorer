FROM node:12

WORKDIR /usr/src/app

ENV PORT 3000

COPY ../package.json ./
COPY ../yarn.lock ./

RUN yarn install --prod

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "start"]
