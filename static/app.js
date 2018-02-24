var names_url = 'http://127.0.0.1:5000/names';
var otu_url = 'http://127.0.0.1:5000/otu';
var metadata_base_url = 'http://127.0.0.1:5000/metadata/';
var samples_base_url = 'http://127.0.0.1:5000/samples/';

$.getJSON( names_url, function( data ) {
    $.each( data, function( index, name ) {
        $("#selDataset").append("<option value='" + name +"'>" + name + "</option>")
    });
  });

var otu = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': otu_url,
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

function optionChanged(sampleid) {
    var metadata = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': metadata_base_url + sampleid,
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })(); 
    
    $("#age").text("AGE: " + metadata.AGE);
    $("#bbtype").text("BBTYPE: " + metadata.BBTYPE);
    $("#ethnicity").text("ETHNICITY: " + metadata.ETHNICITY);
    $("#gender").text("GENDER: " + metadata.GENDER);
    $("#location").text("LOCATION: " + metadata.LOCATION);
    $("#sampleid").text("SAMPLEID: " + metadata.SAMPLEID);

    var samples = (function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': samples_base_url + sampleid,
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

    var otu_ids = []; 
    var sample_values = [];
    for (i=0; i < 10; i++) {
        if (samples.sample_values[i] == 0) {
            break;
        }
        otu_ids.push(samples.otu_ids[i]);
        sample_values.push(samples.sample_values[i]);
    }
    buildPieChart(otu_ids, sample_values);
}

function buildPieChart(otu_ids, sample_values) {
    var text = [];
    for (var i in otu_ids) {
        text.push(otu[otu_ids[i]]);
    }
    console.log(text);
    var data = [{
        values: sample_values,
        labels: otu_ids,
        hovertext: text,
        hoverinfo: 'text',
        type: 'pie'
    }];    
    
    var layout = {
        height: 600,
        width: 700,
        title: "Top " + sample_values.length + " Samples"
    };

    Plotly.newPlot("pie-chart", data, layout);
   
};

//Does it make more sense to make data variables before plugging data into chart values?
function buildBubbleChart() {
    Plotly.d3.json(samples_base_url, function(error, response) {
        var trace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            text: otu.lowest_taxonomic_unit_found,
            mode: 'markers',
            marker: {
                color: samples.otu_ids, 
                size: samples.sample_values
            },
            type: 'scatter'
        };

        var data = [trace];

        var layout = {
            title: 'Sample Value vs. OTU ID',
            showlegend: true,
            height: 600,
            width: 600
        };

        Plotly.newPlot("bubble-chart", data, layout);
    });    
};