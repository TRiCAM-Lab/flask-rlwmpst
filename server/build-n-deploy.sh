#!/bin/bash

echo "Build"
gcloud builds submit --tag gcr.io/reinforcement-learning-3b0d3/flask-rlwmpst

echo "Deploy to Firebase"
gcloud run deploy flask-rlwmpst --region us-central1 --platform managed --image gcr.io/reinforcement-learning-3b0d3/flask-rlwmpst


# echo "Serving on Firebase localhost:5005"
# firebase serve

echo "Serving on Firebase app page"
firebase deploy

# to test docker image locally:
# PORT=8080 && docker run -p 9090:${PORT} -e PORT=${PORT} gcr.io/rlwmpst/flask-rlwmpst

# RELEVANT LINKS:
# https://rlwmpst.web.app/
# http://localhost:5005/
# https://cntracs.herokuapp.com/
# https://cloud.google.com/run/docs/troubleshooting
