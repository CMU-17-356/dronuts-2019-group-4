FROM node:8-alpine
MAINTAINER dronuts-2019-group-4

# Change working directory
WORKDIR dronuts

# Install App Dependencies
COPY package*.json ./
RUN npm install

# Copy App Source
COPY . .
#TODO Run any build scripts here

EXPOSE 80
CMD [ "npm", "start" ]
