// Funtction that activate on page load to run all functions below
function dropDown() {
// read in my data then assign it to variable called data
  d3.json('samples.json').then((data) => {
    //assign all the names in my data to an array with a variable named id
      var id = data.names;
      //select the part of the menu where the drop down box is located
      var display = d3.select("#selDataset");
      //for loop to loop through all my id's and assign them to new varible called sample
      id.forEach((sample) => {
          // append the display drop down corrosponding to the optionChanged in the index and list the number corrosponding with sample as a single value per line
          display.append("option").text(sample).property('value', sample);
      });
      //varible that pulls the the first sample number in the list
      var sampOne = id[0];
      //run function on the first sample to display my number in the box
      displaydata(sampOne);
      //runs function to plot my first sample as a bar chart and bubble chart
      plotCharts(sampOne);
      //runs the function to plot my gauge on the first sample
      plotGauge(sampOne)
  });
}
// This line activates my drop down
dropDown();

function optionChanged(newSample) {
  displaydata(newSample);
  plotCharts(newSample);
  plotGauge(newSample);
}

function displaydata(sampleid) {
  d3.json('samples.json').then((data) => {
      var Mdata = data.metadata;
      var filtered = Mdata.filter(row => row.id == sampleid);
      var result = filtered[0];
      var pBody = d3.select('#sample-metadata');
      pBody.html('');
      Object.entries(result).forEach(([key, value]) => {
          pBody.append('h6').text(`${key} ${value}`);
      });

  });
}

function plotCharts(specimen) {
  d3.json('samples.json').then((data) => {
      var samps = data.samples
      var picksamp = samps.filter(row => row.id == specimen);
      console.log(specimen);
      var label = picksamp[0].otu_ids.sort((a, b) => b - a).slice(0, 10);
      var value = picksamp[0].sample_values.sort((a, b) => b - a).slice(0, 10).map(otuID => `otu${otuID}`);
      var floaty_text = picksamp[0];

      var barchart = [{
          x: label.reverse(),
          y: value,
          type: 'bar',
          text: floaty_text,
          orientation: 'h'

      }];
      var chartspecifics = {
          title: 'Top 10 Bacteria per sample',
          yaxis: {
              title: 'Bacteria ID',
              tickmode: 'array',
              tickval: label
          },
          xaxis: {
              title: 'frequeny'
          }
      };

      var bubbschart = [{
          x: label,
          y: value,
          type: 'bubble',
          text: floaty_text,
          mode: 'markers',
          marker: {
              color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)', 'rgb(255, 127, 0)', 'rgb(255, 219, 0)', 'rgb(87, 219, 0)', 'rgb(87, 219, 209)', 'rgb(87, 94, 209)', 'rgb(252, 94, 209)'],
              opacity: [1, 0.8, 0.6, 0.4],
              size: [25, 35, 45, 55, 65, 75, 85, 95, 105, 115]
          }


      }];
      var bubbsspecifics = {
          title: 'Top 10 Bacteria per sample',
          yaxis: {
              title: 'Bacteria ID',
              tickmode: 'array',
              tickval: label
          },
          xaxis: {
              title: 'frequeny'
          }
      };


      Plotly.newPlot('bar', barchart, chartspecifics);
      Plotly.newPlot('bubble', bubbschart, bubbsspecifics);


  });
}

function plotGauge(wash) {
  d3.json('samples.json').then((data) => {
      var metaData = data.metadata;
      var pickFreq = metaData.filter(row => row.id == wash);
      var washFreq = pickFreq[0].wfreq
      console.log(washFreq)

      var data = [{
          type: "indicator",
          mode: "gauge+number+delta",
          value: washFreq,
          title: {
              text: "Number of belly button washes",
              font: {
                  size: 24
              }
          },
          delta: {
              reference: 5,
              increasing: {
                  color: "RebeccaPurple"
              }
          },
          gauge: {
              axis: {
                  range: [null, 10],
                  tickwidth: 1,
                  tickcolor: "darkblue"
              },
              bar: {
                  color: "darkblue"
              },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [{
                      range: [0, 5],
                      color: "cyan"
                  },
                  {
                      range: [5, 10],
                      color: "royalblue"
                  }
              ],
          }
      }];

      var layout = {
          width: 500,
          height: 400,
          margin: {
              t: 25,
              r: 25,
              l: 25,
              b: 25
          },
          paper_bgcolor: "lavender",
          font: {
              color: "darkblue",
              family: "Arial"
          }
      };

      Plotly.newPlot('gauge', data, layout);

  });
}