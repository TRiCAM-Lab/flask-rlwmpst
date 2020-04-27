# 1 - base image
FROM python:3.7

# 2 - install dependencies
RUN python --version
RUN pip install Flask gunicorn

COPY src/ /app
WORKDIR /app

# 4 - port set in app.py
ENV PORT 8080

# 5
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app