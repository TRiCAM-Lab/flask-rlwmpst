import os
from flask import Flask, render_template, make_response, Blueprint

app = Flask(__name__)


@app.route('/')
def index():
    '''flask by default will look for index.html'''
    return render_template('index.html')


# @app.route('/', methods=['GET', 'POST'])
# @app.route('/get_rlwmpst_trials')
# def get_rlwmpst_trials():
#     return rlwmpst.get_trials()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
