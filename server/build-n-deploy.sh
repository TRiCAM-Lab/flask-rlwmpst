#!/bin/bash

echo "Build"
gcloud builds submit --tag gcr.io/rlwmpst/flask-rlwmpst

echo "Deploy to Firebase"
gcloud run deploy flask-rlwmpst --region us-central1 --platform managed --image gcr.io/rlwmpst/flask-rlwmpst

echo "Serving on Firebase localhost:5000"
firebase serve

# echo "Serving on Firebase app page"
# firebase deploy