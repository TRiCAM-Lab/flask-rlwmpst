#!/bin/bash

echo "Build"
gcloud builds submit --tag gcr.io/rlwmpst/flask-rlwmpst

echo "Deploy to Firebase"
gcloud run deploy flask-rlwmpst --region us-central1 --platform managed --image gcr.io/rlwmpst/flask-rlwmpst