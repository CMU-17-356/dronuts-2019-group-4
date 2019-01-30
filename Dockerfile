FROM node:8-alpine
MAINTAINER dronuts_

# Change working directory
WORKDIR /usr/src/app

# Install App Dependencies
COPY dronuts/. .
RUN npm install

# Copy App Source
#TODO Run any build scripts here

EXPOSE 80
CMD [ "npm", "start" ]
