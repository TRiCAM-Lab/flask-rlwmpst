import os
from flask import Flask, render_template, make_response, Blueprint

app = Flask(__name__)


@app.route('/')
def index():
    '''flask by default will look for index.html'''
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
