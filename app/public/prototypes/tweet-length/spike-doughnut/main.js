var TW_BLUE     = 'hsl(206, 82%, 63%)'; // #55acee
var SAMPLE_SIZE = 200;

var r1, r2, r3, tweetsRaw, tweetsData, tweetsSample;

r1 = $.getJSON("../../data/1000/tweetsData.json", function(data) { tweetsData = data; });

$.when(r1).done(init);

function init() {

  // reference -> http://bl.ocks.org/bbest/2de0e25d4840c68f2db1

	var width = window.innerWidth,
    height = window.innerHeight,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.1 * radius;

  var data = _.pluck(tweetsData, 'chars').slice(0, SAMPLE_SIZE);
  var maxLen = _.max(data);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return 1; });

  var arc = d3.svg.arc();
    // .innerRadius(radius/2);
    // .outerRadius(function (d) {
    //   return (((radius-innerRadius)*(d.data / maxLen))+innerRadius);
    // });

  var outlineArc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

  var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("class", "solidArc")
      .attr("fill", colorize);
      // .attr("stroke", colorize)
      // .on('mouseover', onMouseOver)
      // .on('mouseout', tip.hide);

  // var outerPath = svg.selectAll(".outlineArc")
  //     .data(pie(data))
  //   .enter().append("path")
  //     .attr("fill", "none")
  //     .attr("stroke", "gray")
  //     .attr("class", "outlineArc")
  //     .attr("d", outlineArc);

  function colorize(d) {
    var maxL = 63;
    var minA = 0.05;
    var maxA = 1;
    // return 'hsl(206, 82%, '+ (d.data/140)*maxL + '%)';
    return 'hsla(206, 82%, 63%, '+ (((d.data/maxLen)*(maxA-minA))+minA) + ')';
    // return 'hsla(206, 82%, 63%, '+ ((maxA-((d.data/maxLen)*(maxA-minA)))+minA) + ')';
  }

  function arcAnimateFromCentre(d) {
    var i = d3.interpolate(0, ((radius/4)*(d.data/maxLen)));
    return function(t) {
      d.outerRadius = (radius/2) + i(t);
      d.innerRadius = (radius/2) - i(t);
      return arc(d);
    };
  }

  function transitionIn() {

    var totalTime = 300;
    var delay = totalTime / data.length;

    path
      .transition()
      // .delay(function(d, i) { return i * delay; })
      .delay(function(d, i) {
        // return (d.data/maxLen)*totalTime;
        return (i*delay);
        // return Math.random()*totalTime;
      })
      .duration(2000)
      .ease('elastic')
      .attrTween("d", arcAnimateFromCentre);

  }

  // $('body').on('click', transitionIn);
  transitionIn();

}
