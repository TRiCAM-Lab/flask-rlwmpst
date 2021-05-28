# RLWMPST
<p float="left">
  <img src="favicon.png" width="200" />
</p>

This repo contains the RLWMPST, which is also known as the reinforcement learning working memory probabilistic selection task. It is a [jspsych](https://www.jspsych.org/) task which uses a Python-based task logic as well as a [Flask](https://flask.palletsprojects.com/en/1.1.x/) server. This task is compatible with [Firebase](https://firebase.google.com/) for cloud hosting & data storage.


## Potentially Helpful Background Docs
- https://medium.com/firebase-developers/hosting-flask-servers-on-firebase-from-scratch-c97cfb204579 \
Since the task uses a Python-based task logic (flask-rlwmpst/server/src/rlwmpst.py) to generate its task trials to then be read in as a JsPsych timeline, we host the Python file on a Flask server (flask-rlwmpst/server/Dockerfile). I primarily followed the steps in the above article to get started. Key things are to install Gcloud and firebase.


## TO RUN THE TASK - BEHAVIORAL ONLY

1. Clone this repo onto your computer
```
git clone https://github.com/wasita/flask-rlwmpst.git
```
2. Navigate to the flask-rlwmpst directory
3. Install npm (via the terminal, once you're in the flask-rlwmpst directory) before installing the firebase tools package. You may first need to install Node.js (https://nodejs.org/en/download/) before being able to use npm commands in the terminal.
```
npm install
```
4. Install firebase
```
npm init -y # creates a package.json
npm install -D firebase-tools
```
5. Install Gcloud
```
gcloud init
```
6. Configure the task for firebase & Gcloud on their respective websites. <b>Note from Wasita: better documentation pending...</b>
7. After the task is set up to be hosted on firebase, you can run the bash script found in flask-rlwmpst/server/ to deploy the task (sh build-n-deploy.sh). Once the task is deployed, you can navigate to the link you've chosen (via firebase hosting) to host your task on in order to do the task there. To save the data, the task uses a query string in the URL (PID) to get the ID.
