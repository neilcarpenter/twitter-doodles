var TW_BLUE     = 'hsl(206, 82%, 63%)'; // #55acee
var SAMPLE_SIZE = 1000;

var r1, r2, r3, tweetsRaw, tweetsData, tweetsSample;

r1 = $.getJSON("../../data/1000/tweetsData.json", function(data) { tweetsData = data; });

$.when(r1).done(init);

function init() {

	var width = window.innerWidth,
    height = window.innerHeight,
    radius = Math.min(width, height) / 2,
    maxRadius = radius * 0.9,
    innerRadius = 0.2 * maxRadius;

  var data = [];
  var _data = _.pluck(tweetsData, 'created_at').slice(0, SAMPLE_SIZE);
  for (var i = 0, len = _data.length; i < len; i++) {
    var d = new Date(_data[i]);
    d.setHours(d.getHours() + Math.round(d.getMinutes()/60));
    data.push(d.getHours());
  }

  var max = _.max(data);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return 1; });

  var arc = d3.svg.arc();
    // .innerRadius(function(d) {
    //   return (((d.data-1)/24)*(maxRadius-innerRadius))+innerRadius;
    // })
    // .outerRadius(function (d) {
    //   return ((d.data/24)*(maxRadius-innerRadius))+innerRadius;
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
      // .attr("d", arc);
      // .attr("stroke", colorize);
      // .on('mouseover', onMouseOver);
      // .on('mouseout', tip.hide);

  function colorize(d) {
    var maxL = 63;
    var minA = 0.1;
    var maxA = 1;
    // return 'hsl(206, 82%, '+ (d.data/140)*maxL + '%)';
    // return 'hsla(206, 82%, 63%, '+ (((d.data/max)*(maxA-minA))+minA) + ')';
    return 'hsla(206, 82%, 63%, '+ ((maxA-((d.data/max)*(maxA-minA)))+minA) + ')';
  }

  function animateArc(d) {
    var i = d3.interpolate(maxRadius, (((d.data-1)/24)*(maxRadius-innerRadius))+innerRadius);
    var i2 = d3.interpolate(maxRadius, ((d.data/24)*(maxRadius-innerRadius))+innerRadius);
    return function(t) {
      d.outerRadius = i2(t);
      d.innerRadius = i(t);
      return arc(d);
    };
  }

  function transitionIn() {

    var totalTime = 3000;
    var delay = totalTime / data.length;

    path
      .transition()
      // .delay(function(d, i) { return i * delay; })
      .delay(function(d, i) {
        return (d.data/max)*totalTime;
        // return ((d.data/max)*totalTime)+(i*delay);
        // return (i*delay);
        // return Math.random()*totalTime;
      })
      .duration(600)
      .ease('cubic-in-out')
      // .ease('quad-out')
      .attrTween("d", animateArc);

  }

  // $('body').on('click', transitionIn);
  transitionIn();

}
