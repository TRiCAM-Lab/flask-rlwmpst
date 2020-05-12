# 1 - set image of container to run python version 3.7
FROM python:3.7

# 2 - install dependencies needed to run server: flask and gunicorn
RUN python --version
RUN pip install Flask gunicorn pandas psycopg2-binary flask-wtf

# 3 - copy server's source files into folder within container named app
# then set the working directory to that app folder
COPY src/ /app
WORKDIR /app

# 4 - set environment variable for the port to be 8080
# cloud run expects port to be 8080
# port set in app.py
ENV PORT 8080

# 5 - run gunicorn bound to 8080 port
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
