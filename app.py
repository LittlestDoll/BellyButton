from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/names')
def names():

@app.route('/otu')
def otu():

@app.route('/metadata/<sample>')
def metadata():

@app.route('/wfreq/<sample>')
def wfreq():

@app.route('/samples/<sample>')
def samps():                

if __name__ == "__main__":
    app.run(debug=True)