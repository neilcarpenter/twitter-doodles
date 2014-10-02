var TW_BLUE     = 'hsl(206, 82%, 63%)'; // #55acee
var SAMPLE_SIZE = 200;
var HOURS       = 24; // duh

var r1, r2, r3, tweetsRaw, tweetsData, tweetsSample;

r1 = $.getJSON("../../data/1000/tweetsData.json", function(data) { tweetsData = data; });

$.when(r1).done(init);

function init() {

	var width = window.innerWidth,
    height = window.innerHeight,
    radius = Math.min(width, height) / 2,
    maxRadius = radius * 0.9,
    innerRadius = 0.2 * maxRadius,
    segmentHeight = (radius - innerRadius) / HOURS;

  var data = [];
  var _data = _.pluck(tweetsData, 'created_at').slice(0, SAMPLE_SIZE);
  for (var i = 0, len = _data.length; i < len; i++) {
    var d = new Date(_data[i]);
    d.setHours(d.getHours() + Math.round(d.getMinutes()/60));
    data.push(d.getHours());
  }

  var max = _.max(data);

  var dataCoords = calculatePolyPoints(data);
  var startDataCoords = [];

  for (var k = 0, len2 = data.length+1; k < len2; k++) {
    startDataCoords.push({ x:0, y:0 });
  }

  var hoursData = [];
  for (var j = 0; j < HOURS; j++) { hoursData.push(j); }

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return 1; });

  // var arc = d3.svg.arc()
    // .innerRadius(innerRadius)
    // .outerRadius(radius);
    // .innerRadius(function(d) {
    //   return (((d.data-1)/HOURS)*(maxRadius-innerRadius))+innerRadius;
    // })
    // .outerRadius(function (d) {
    //   return ((d.data/HOURS)*(maxRadius-innerRadius))+innerRadius;
    // });

  var guideArc = d3.svg.arc()
    .startAngle(function() { return 0; })
    .endAngle(function() { return Math.PI * 2; })
    .innerRadius(function(d, i) { return innerRadius + (i * segmentHeight); })
    .outerRadius(function(d, i) { return innerRadius + (i * segmentHeight) + segmentHeight; });

  // var x = d3.scale.linear()
  //   .range(-[(maxRadius-innerRadius), (maxRadius-innerRadius)]);

  // var y = d3.scale.linear()
  //   .range([(maxRadius-innerRadius), -(maxRadius-innerRadius)]);

  var line = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("basis");

  // var line = d3.svg.line()
  //   .x(function(d) { return x(d.date); })
  //   .y(function(d) { return y(d.close); });

  var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  // var path = svg.selectAll(".solidArc")
  //     .data(pie(data))
  //   .enter().append("path")
  //     .attr("class", "solidArc")
  //     .attr("fill", colorize);
      // .attr("d", arc);
      // .attr("stroke", colorize);
      // .on('mouseover', onMouseOver);
      // .on('mouseout', tip.hide);

  var guidePath = svg.selectAll(".outlineArc")
      .data(pie(hoursData))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#565656")
      .attr("class", "outlineArc")
      .attr("d", guideArc);

  // var path = svg.selectAll(".line")
  //     .data(data)
  //   .enter().append("path")
  //     .attr("class", "line")
  //     .attr("data-time", function(d) { return d;})
  //     .attr("d", line);

  // var polygon = svg.selectAll('.area')
  //     .data(data)
  //   .enter().append("polygon")
  //     .attr("class", "poly")
  //     .attr('points', calculatePolyPoints);

  var linesvg = svg.append("path")
    .datum(startDataCoords)
      .attr("class", "line")
      .attr("d", line);

  function calculatePolyPoints(data) {

    var x;
    var y;
    var angle;
    var hyp;
    var points = [];

    data.forEach(function(d, i) {

      angle = i * ((Math.PI * 2) / SAMPLE_SIZE);
      hyp = innerRadius + (d * segmentHeight) + (segmentHeight / 2);
      x = Math.sin(angle) * hyp;
      y = -(Math.cos(angle) * hyp);

      // points.push(x+','+y);
      points.push({ x:x, y:y });

    });

    // add first point at end, tie the thing up
    points.push({ x:points[0].x, y:points[0].y });

    // return points.join(' ');
    return points;

  }

  function colorize(d) {
    var maxL = 63;
    var minA = 0.1;
    var maxA = 1;
    // return 'hsl(206, 82%, '+ (d.data/140)*maxL + '%)';
    // return 'hsla(206, 82%, 63%, '+ (((d.data/max)*(maxA-minA))+minA) + ')';
    return 'hsla(206, 82%, 63%, '+ ((maxA-((d.data/max)*(maxA-minA)))+minA) + ')';
  }

  function animateArc(d) {
    var i = d3.interpolate(maxRadius, (((d.data-1)/HOURS)*(maxRadius-innerRadius))+innerRadius);
    var i2 = d3.interpolate(maxRadius, ((d.data/HOURS)*(maxRadius-innerRadius))+innerRadius);
    return function(t) {
      d.outerRadius = i2(t);
      d.innerRadius = i(t);
      return arc(d);
    };
  }

  function animateLine(d) {
    var i = d3.interpolateArray(d, dataCoords);
    return function(t) {
      return line(i(t));
    };
  }

  function transitionIn() {

    var totalTime = 3000;
    var delay = totalTime / data.length;

    linesvg
      .transition()
      // .delay(function(d, i) { return i * delay; })
      .delay(function(d, i) {
        // return (d.data/max)*totalTime;
        // return ((d.data/max)*totalTime)+(i*delay);
        return (i*delay);
        // return Math.random()*totalTime;
      })
      .duration(600)
      .ease('elastic')
      // .ease('quad-out')
      .attrTween("d", animateLine);

  }

  // $('body').on('click', transitionIn);
  transitionIn();

}
