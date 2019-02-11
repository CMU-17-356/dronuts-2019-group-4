FROM node:8-alpine
MAINTAINER dronuts_4

# Change working directory
WORKDIR /usr/src/app

# Install App Dependencies
COPY . .
RUN npm install
RUN npm uninstall ajv
RUN npm install ajv@6.8.1

# Copy App Source
#TODO Run any build scripts here

EXPOSE 3000
CMD [ "npm", "start" ]
