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
// This line activates my drop down function which connects all other functions below
dropDown();
// This fuunction runs all my functions below when a new number is selected from the drop down
function optionChanged(newSample) {
  displaydata(newSample);
  plotCharts(newSample);
  plotGauge(newSample);
}
// This function changes the data displayed in the display box and saves it as variable sampleid
function displaydata(sampleid) {
  //read in my data save it as varible data
  d3.json('samples.json').then((data) => {
    //pull the metadata from the data variable
      var Mdata = data.metadata;
      //filter the metadata assigning it to row and matching the row id to the sample id 
      var filtered = Mdata.filter(row => row.id == sampleid);
      //pulling the first set of data from the list
      var result = filtered[0];
      // selecting the panel body where the data will go
      var pBody = d3.select('#sample-metadata');
      //this empties the panel body upon new selection
      pBody.html('');
      //this enteres each item in the data list to the panel body
      Object.entries(result).forEach(([key, value]) => {
        // the $ is like the f statement in pythin. it allows you to insert a variable into a string
          pBody.append('h6').text(`${key} ${value}`);
      });

  });
}
// New function that plots the data for each specimen
function plotCharts(specimen) {
  // read in my data as data
  d3.json('samples.json').then((data) => {
    //pull the samples from the data
      var samps = data.samples
      //filter the sample datas where the id is equal to the specimen
      var picksamp = samps.filter(row => row.id == specimen);
      console.log(specimen);
      // pull the OTU labels from my selected samples sort them from highest to lowest and slice to return the top 10
      var label = picksamp[0].otu_ids.sort((a, b) => b - a).slice(0, 10);
      // pull the sample values of my specimen sort it and return the top 10 and then map the names to the values so that they appear on my Y Axis
      var value = picksamp[0].sample_values.sort((a, b) => b - a).slice(0, 10).map(otuID => `otu${otuID}`);
      //pick the text so tjat it displays when the mouse moves over them
      var floaty_text = picksamp[0];
      // saves my desired barchart specs to a variable most this can be found in plotly docs
      var barchart = [{
          x: label.reverse(),
          y: value,
          type: 'bar',
          text: floaty_text,
          orientation: 'h'

      }];
      // assign chart title and fin detials to varible. also can be found on pltly 
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
      // do the same for my bubble chart specs can be found on pltly docs
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
      //buble chart details just follow plotly docs
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

      //plot both my graphs
      Plotly.newPlot('bar', barchart, chartspecifics);
      Plotly.newPlot('bubble', bubbschart, bubbsspecifics);


  });
}
//new function for my gauge because its a different array within the data but all the same as above and styling is from pltly docs
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
      // plot my gauge
      Plotly.newPlot('gauge', data, layout);

  });
}