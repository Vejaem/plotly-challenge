// Use D3 to read json document and build metadata
function getData(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        var objectSample = metadata.filter(objectSample => objectSample.id == sample);
        var resultSample = objectSample[0];
        console.log(objectSample);

        var Panel = d3.select("#sample-metadata");

        Panel.html("");

        Object.entries(resultSample).forEach(([key, value]) => {
            Panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
            console.log(key, value);

        });
    });
}

// Create Charts
function charts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples.filter(objectSample => objectSample.id == sample)[0];
        console.log(samples);
        var yTicks = samples.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
        var barChart = [
            {
                y: yTicks,
                x: samples.sample_values.slice(0, 10),
                text: samples.otu_labels.slice(0, 10),
                type: "bar",
                orientation: "h"

            }
        ];

        var barLayout = {
            title: "Top Ten Bacteria",
            margin: { t: 30, l: 150 },
            yaxis: {
                autorange:"reversed"
            }
        };


        Plotly.newPlot("bar", barChart, barLayout);  
   
      //Create bubble chart
        var bubbleChart = [
            {
                x: samples.otu_ids,
                y:samples.sample_values,
                text:samples.otu_labels,
                mode:"markers",
                marker:{
                    size: samples.sample_values,
                    color: samples.otu_ids,
                    colorscale:"Hot"
                }
            }
        ]; 

        var bubbleLayout = {
            title:"Bacteria per Sample",
            margin: {t:0},
            hovermode: "closest",
            xaxis: { title:"OTU ID"},
            margin: {t:30}

        };


        Plotly.newPlot("bubble", bubbleChart, bubbleLayout);  
    });

}

function changes(next) {
    getData(next)
    charts(next)
};


function init(){
    d3.json("samples.json").then((data) => {
        console.log(data);
        var selector = d3.select("#selDataset");
        var names= data.names;
        names.forEach((id) =>{
            selector.append("option")
                    .text(id)
                    .property("value",id);
        });

    const firstOne = names[0];
    getData(firstOne);
    charts(firstOne);
    });
}

    // Initialize
init();