FROM keymetrics/pm2:latest-alpine

WORKDIR /app

# Bundle APP files
COPY . .
COPY package.json .
COPY ecosystem.config.js .

RUN apk add bash

# Install app dependencies
RUN npm install pm2 -g
RUN npm install
RUN pm2 install profiler
ENV PM2_PUBLIC_KEY 0lnb5u7d58x3ore
ENV PM2_SECRET_KEY cq29svwb1l2twti
ENV NPM_CONFIG_LOGLEVEL warn
ENV PM2_MACHINE_NAME HardGaming


# Expose the listening port of your app
EXPOSE 3098

# Show current folder structure in logs
# RUN ls -al -R

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
