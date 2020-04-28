import os
from flask import Flask, render_template, make_response, Blueprint
# import rlwmpst

app = Flask(__name__)


@app.route('/')
def index():
    '''flask by default will look for index.html'''
    return render_template('index.html')


# @app.route('/get_rlwmpst_trials')
# def get_rlwmpst_trials():
#     '''get rlwmpst task logic to generate timeline'''
#     return rlwmpst.get_trials()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',
            port=int(os.environ.get('PORT', 8080)))
