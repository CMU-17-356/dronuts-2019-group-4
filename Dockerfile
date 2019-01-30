FROM node:8-alpine
MAINTAINER <GROUP_NAME_HERE>

# Change working directory
WORKDIR /usr/src/app

# Install App Dependencies
COPY dronuts/package*.json ./
RUN npm install

# Copy App Source
COPY dronuts/ .
#TODO Run any build scripts here

EXPOSE 80
CMD [ "npm", "start" ]
