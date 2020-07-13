# Step 1 - set image of container to run python version 3.7
FROM python:3.7

# Step 2 - check python version/verify installation
RUN python --version

# Step 3 - install dependencies needed to run server: flask and gunicorn
RUN pip install Flask gunicorn pandas psycopg2-binary flask-wtf

# Step 4 - copy server's source files into folder within container named app
# Step 5 - then set the working directory to that app folder
COPY src/ /app
WORKDIR /app

# Step 6 - set environment variable for the port to be 8080
# cloud run expects port to be 8080
# port set in app.py
ENV PORT 8080

# Step 7 - run gunicorn bound to 8080 port
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
