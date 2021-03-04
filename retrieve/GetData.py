from collections.abc import Mapping

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('./service-account-key.json')
firebase_admin.initialize_app(cred)


db = firestore.client()

trials = db.collection(u'db_pilot_test').document(u'600cc5ed47b7d84103754576').collection(u'data').stream()
print(f"getting training trials")
train_trials = [trial.to_dict() for trial in trials if trial.to_dict().get("train_or_test") == "train"]

no_train_trials =  [
    trial for trial in train_trials
    if trial.get("key_press") == None
]

correct_train_trials =  [
    trial for trial in train_trials
    if trial.get("key_press") == trial.get("correct_key")
]

print(f"number of train trials: {len(train_trials)}")
print(f"number of no response train trials: {len(no_train_trials)}")
print(f"number of correct train trials: {len(correct_train_trials)}")

trials = db.collection(u'db_pilot_test').document(u'600cc5ed47b7d84103754576').collection(u'data').stream()
print("getting test trials")
test_trials = [trial.to_dict() for trial in trials if trial.to_dict().get("train_or_test") == "test"]

no_test_trials =  [
    trial for trial in test_trials
    if trial.get("key_press") == None
]
print(f"number of test trials: {len(test_trials)}")
print(f"number of no response test trials: {len(no_test_trials)}")
