# Set base image (host OS)
FROM sport-wizzard-base:latest

# By default, listen on port 5000
EXPOSE 5000/tcp

# Set the working directory in the container
WORKDIR /app

# Copy the content of the local src directory to the working directory
COPY webapp.py .
COPY utils ./utils/
COPY odds-lines-data ./odds-lines-data/
COPY static ./static/
COPY templates ./templates
COPY player_stats ./player_stats/

# Specify the command to run on container start
CMD [ "python3", "./webapp.py" ]
