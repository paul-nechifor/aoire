FROM node:6

RUN \
  npm install nodemon@1.11.0 -g -q && \
  mkdir /app && \
  chown node:node /app

USER node
WORKDIR /app

ADD package.json /app
RUN npm install -q

ADD . /app

ENV port 3000
EXPOSE 3000
CMD ["node", "/app/src/index.js"]
