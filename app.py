from flask import Flask, render_template, jsonify
from model import Model

app = Flask(__name__)
model = Model()

@app.route('/')
def home():
    """Return the dashboard homepage."""
    return render_template('index.html')

@app.route('/app.js')
def appjs():
    return app.send_static_file('app.js')

@app.route('/names')
def names():
    """List of sample names.
    Returns a list of sample names
    """
    names = model.get_names()
    return jsonify(names)

@app.route('/otu')
def otu():
    """List of OTU descriptions.
    Returns a list of OTU descriptions 
    """
    otus = model.get_otu_list()
    return jsonify(otus)

@app.route('/metadata/<sample>')
def metadata(sample):
    """MetaData for a given sample - as a dict
    Args: Sample in the format: `BB_940`

    Returns a json dictionary of sample metadata
    """
    sampleid = sample.split("_")[1]
    return jsonify(model.get_sample(sampleid))
    
@app.route('/wfreq/<sample>')
def wfreq(sample):
    """Weekly Washing Frequency as a number.

    Args: Sample in the format: `BB_940`

    Returns an integer value for the weekly washing frequency `WFREQ`
    """
    sampleid = sample.split("_")[1]
    return jsonify(model.get_freq(sampleid))

@app.route('/samples/<sample>')
def samps(sample):   
    """OTU IDs and Sample Values for a given sample.

    Sorted in descending order.
    """  
    return jsonify(model.get_otuID_and_values(sample))           

if __name__ == "__main__":
    app.run(debug=True)