FROM node:14.15.3

WORKDIR /opt/server

COPY ./server/yarn.lock ./server/yarn.lock ./

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
