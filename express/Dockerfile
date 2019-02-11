FROM node:8-alpine
MAINTAINER dronuts_4

# Change working directory
WORKDIR /usr/src/app

# Install App Dependencies
COPY . .
RUN npm install

# Copy App Source
#TODO Run any build scripts here

EXPOSE 80
CMD [ "npm", "start" ]
