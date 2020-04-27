import os
from flask import Flask, render_template, make_response, Blueprint
import rlwmpst

app = Flask(__name__)

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__,
                        template_folder='templates', static_folder='./static')


@custom_code.route('/', methods=['GET', 'POST'])
@custom_code.route('/get_rlwmpst_trials')
def get_rlwmpst_trials():
    '''get rlwmpst task logic to generate timeline'''
    return rlwmpst.get_trials()


@app.route('/')
def index():
    '''flask by default will look for index.html'''
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
