var TW_BLUE     = 'hsl(206, 82%, 63%)'; // #55acee
var SAMPLE_SIZE = 200;

var r1, r2, r3, tweetsRaw, tweetsData, tweetsSample;

r1 = $.getJSON("../../data/1000/tweetsRaw.json", function(data) { tweetsRaw = data; });
r2 = $.getJSON("../../data/1000/tweetsData.json", function(data) { tweetsData = data; });
r3 = $.getJSON("../../data/1000/tweetsSample.json", function(data) { tweetsSample = data; });

$.when(r1, r2, r3).done(init);

function init() {

  var data = [];
  var _data = _.pluck(tweetsData, 'created_at').slice(0, SAMPLE_SIZE);
  for (var i = 0, len = _data.length; i < len; i++) {
    var d = new Date(_data[i]);
    d.setHours(d.getHours() + Math.round(d.getMinutes()/60));
    data.push(d.getHours());
  }

  var max = _.max(data);

  var width = window.innerWidth,
    height = window.innerHeight,
    barHeight = height / data.length,
    barWidth = width / 24;

  var x = d3.scale.linear()
      .domain([0, max])
      .range([0, width]);

  var svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height);

  var bar = svg.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
    .attr("width", 0)
    .attr("x", 0)
    // .attr("y", height)
    .attr("class", "bar")
    .attr("fill", colorize)
    .attr("height", barHeight);

  function colorize(d) {
    var maxL = 63;
    var minA = 0.2;
    var maxA = 1;
    // return 'hsl(206, 82%, '+ (d/140)*maxL + '%)';
    return 'hsla(206, 82%, 63%, '+ (((d/max)*(maxA-minA))+minA) + ')';
    // return 'hsla(206, 82%, 63%, '+ ((maxA-((d/max)*(maxA-minA)))+minA) + ')';
  }

  function transitionIn() {

    var totalTime = 1200;
    var delay = totalTime / data.length;
    var pause = 1200;

    var bars = svg.selectAll(".bar");

    bars
      .transition()
      // .delay(function(d, i) { return i * delay; })
      .delay(function(d, i) {
        // return ((d/max)*totalTime)+(i*5);
        // return (i*delay);
        return Math.random()*totalTime;
      })
      .duration(1000)
      .ease('quad-in-out')
      .attr("x", function(d) { return d*barWidth; })
      // .attr("y", 0)
      // .transition()
      // // .delay(function(d, i) { return i * delay; })
      // .delay(function(d, i) {
      //   return (((d/max)*totalTime)+(i*5))+totalTime+pause;
      //   // return (i*delay);
      //   // return Math.random()*totalTime;
      // })
      // .duration(300)
      // .ease('quad-in-out')
      .attr("width", barWidth);

  }

  transitionIn();

}
