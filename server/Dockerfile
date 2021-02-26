FROM node:12.20.2-alpine3.10
COPY ./* /home/server/
RUN cd /home/server && npm install pm2 -g && npm install

ENTRYPOINT ["node","/home/server/server.js"]
