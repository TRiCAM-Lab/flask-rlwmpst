#import sys
from collections.abc import Mapping

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('./service-account-key.json')
firebase_admin.initialize_app(cred)

#define database
db = firestore.client()

#potential way to pull ID names from a csv files
#do this instead of getting all subjects
#command call python GetData.py < IDs.csv
# for row in sys.stdin:
#     id = row.strip()
#     sub = db.document(u'db_pilot_test', id).get()

#Get all subjects
subs = db.collection(u'db_pilot_test').stream()

#loop through the subjects
for sub in subs:
    print(f'{sub.id}, {sub.to_dict()}')

    # Get a collection from anywhere
    trials = db.collection(u'db_pilot_test', sub.id, u'data').stream()
    print(f"getting training trials")

    #Get just the training data
    train_trials = [trial.to_dict() for trial in trials if trial.to_dict().get("train_or_test") == "train"]

    #Get just
    trials = db.collection(u'db_pilot_test', sub.id, u'data').stream()
    print("getting test trials")
    test_trials = [trial.to_dict() for trial in trials if trial.to_dict().get("train_or_test") == "test"]
