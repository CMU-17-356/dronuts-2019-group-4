FROM node:8-alpine
MAINTAINER dronuts-2019-group-4

# Change working directory
WORKDIR /home/azureuser/dronuts/

# Install App Dependencies
COPY dronuts/package*.json /home/azureuser/dronuts/
RUN npm install

# Copy App Source
COPY dronuts/* /home/azureuser/dronuts/
#TODO Run any build scripts here

EXPOSE 80
CMD [ "node", "dronuts" ]
