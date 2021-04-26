FROM node:12.20.2-alpine3.10
COPY ./* /home/server/
COPY ./dataSources/* /home/server/dataSources/
COPY ./data/* /home/server/data/
WORKDIR /home/server
RUN npm install pm2 -g && npm install

ENTRYPOINT ["node","/home/server/server.js"]
