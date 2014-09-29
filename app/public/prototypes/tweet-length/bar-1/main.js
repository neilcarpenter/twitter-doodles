var TW_BLUE     = 'hsl(206, 82%, 63%)'; // #55acee
var SAMPLE_SIZE = 200;

var r1, r2, r3, tweetsRaw, tweetsData, tweetsSample;

r1 = $.getJSON("../../data/1000/tweetsData.json", function(data) { tweetsData = data; });

$.when(r1).done(init);

function init() {

  // reference -> http://bost.ocks.org/mike/bar/3/

  var data = _.pluck(tweetsData, 'chars').slice(0, SAMPLE_SIZE);
  var maxLen = _.max(data);

  var width = window.innerWidth,
    height = window.innerHeight;

  var x = d3.scale.ordinal()
      .rangeBands([0, width], 0);

  var y = d3.scale.linear()
      .range([height, 0]);

  var svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g");

  x.domain(data.map(function(d, i) { return i; }));
  y.domain([0, maxLen]);

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) { return x(i); })
      .attr("width", x.rangeBand())
      .attr("y", height/2)
      .attr("height", 0)
      .attr("fill", colorize);

  function colorize(d) {
    var maxL = 63;
    var minA = 0.01;
    var maxA = 1;
    // return 'hsl(206, 82%, '+ (d/140)*maxL + '%)';
    return 'hsla(206, 82%, 63%, '+ (((d/maxLen)*(maxA-minA))+minA) + ')';
    // return 'hsla(206, 82%, 63%, '+ ((maxA-((d/maxLen)*(maxA-minA)))+minA) + ')';
  }

  function animateHeight(d) {
    var i = d3.interpolate(0, ((radius/4)*(d.data/maxLen)));
    return function(t) {
      d.outerRadius = (radius/2) + i(t);
      d.innerRadius = (radius/2) - i(t);
      return arc(d);
    };
  }

  function transitionIn() {

    var totalTime = 10;
    var delay = totalTime / data.length;

    svg.selectAll(".bar")
      .transition()
      // .delay(function(d, i) { return i * delay; })
      .delay(function(d, i) {
        return ((d/maxLen)*totalTime)+(i*5);
        // return (i*delay);
        // return Math.random()*totalTime;
      })
      .duration(2000)
      .ease('elastic')
      .attr("y", function(d) { return (height-((height - y(d))/2))/2; })
      .attr("height", function(d) { return (height - y(d))/2; });

  }

  transitionIn();

}
