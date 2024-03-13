# Set base image (host OS)
FROM python:3.11.3-alpine

# By default, listen on port 5000
EXPOSE 5000/tcp

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install tools needed to build python packages
RUN apk update
RUN apk add make automake gcc g++ subversion python3-dev

# Install python dependencies
RUN pip install -r requirements.txt

# Copy the content of the local src directory to the working directory
COPY webapp.py .
COPY utils .
COPY odds-lines-data .
COPY static .
COPY templates .
COPY player_stats .

# Specify the command to run on container start
CMD [ "python", "./webapp.py" ]