# How to Run
To run our app simply navigate to the top level folder `/dronuts_group_4`
and run the command `docker-compose -f docker-compose.prod.yml up --build`
This uses the production docker-compose file, and builds the app and then runs
it locally.

Running the development version can be done through `docker-compose up --build`,
where the react web server is used instead of it being built and served
statically through the express server.

Deployment to azure is handled entirely by Travis CI.
