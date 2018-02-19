var names_url='http://127.0.0.1:5000/names';
var otu_url='http://127.0.0.1:5000/otu';
var metadata_base_url='http://127.0.0.1:5000/metadata/';
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
}

// d3.json(url, function(error, data) {
//     if (error) return console.warn(error);
//     var layout = {barmode: 'group'};
    
//    Plotly.newPlot('tester', data.data, layout);
//   });