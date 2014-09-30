var TW_BLUE     = 'hsl(206, 82%, 63%)'; // #55acee
var SAMPLE_SIZE = 200;
var SEGMENTS    = 37; // depends on number of `commonChars` set in worker

var r1, r2, r3, tweetsRaw, tweetsData, tweetsSample;

r1 = $.getJSON("../../data/1000/tweetsData.json", function(data) { tweetsData = data; });

$.when(r1).done(init);

function init() {

	var width = window.innerWidth,
    height = window.innerHeight,
    radius = Math.min(width, height) / 2,
    maxRadius = radius * 0.9,
    innerRadius = 0.2 * maxRadius,
    segmentHeight = (radius - innerRadius) / SEGMENTS;

  window.data = [];
  var _data = _.pluck(tweetsData, 'commonChars').slice(0, SAMPLE_SIZE);
  for (var i = 0, len = _data.length; i < len; i++) {
    data = data.concat(_data[i]);
  }

  var max = _.max(data, function(char) { return char.count; }).count;

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return 1; });

  var arc = d3.svg.arc();
    // .innerRadius(function(d) {
    //   return (((d.data.count-1)/24)*(maxRadius-innerRadius))+innerRadius;
    // })
    // .outerRadius(function (d) {
    //   return ((d.data.count/24)*(maxRadius-innerRadius))+innerRadius;
    // });
    // .innerRadius(ir)
    // .outerRadius(or)
    // .startAngle(sa)
    // .endAngle(ea);

  var svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("class", function(d) { return 'solidArc char-'+d.data.char+' count-'+d.data.count; })
      .attr("fill", colorize);
      // .attr("d", arc);
      // .attr("stroke", colorize);
      // .on('mouseover', onMouseOver);
      // .on('mouseout', tip.hide);


  function ir(d, i) {
    return innerRadius + ((i % SEGMENTS) * segmentHeight);
  }
  function or(d, i) {
    return innerRadius + ((i % SEGMENTS) * segmentHeight) + segmentHeight;
  }
  function sa(d, i) {
    return (Math.floor(i / SEGMENTS)) * ((2 * Math.PI) / SAMPLE_SIZE);
  }
  function ea(d, i) {
    return (Math.floor((i / SEGMENTS)+1)) * ((2 * Math.PI) / SAMPLE_SIZE);
  }

  function colorize(d) {
    var maxL = 63;
    var minA = 0;
    var maxA = 1;
    // return 'hsl(206, 82%, '+ (d.data/140)*maxL + '%)';
    return 'hsla(206, 82%, 63%, '+ (((d.data.count/max)*(maxA-minA))+minA) + ')';
    // return 'hsla(206, 82%, 63%, '+ ((maxA-((d.data.count/max)*(maxA-minA)))+minA) + ')';
  }

  function animateArc(d, i) {
    // var _i = d3.interpolate(0 ,100);
    // var _i2 = d3.interpolate(0 ,120);
    var _i = d3.interpolate(innerRadius, (innerRadius + ((i % SEGMENTS) * segmentHeight)));
    var _i2 = d3.interpolate(innerRadius, (innerRadius + ((i % SEGMENTS) * segmentHeight) + segmentHeight));
    return function(t) {
      d.outerRadius = _i2(t);
      d.innerRadius = _i(t);
      d.startAngle = sa(d,i);
      d.endAngle = ea(d,i);
      return arc(d);
    };
  }

  function transitionIn() {

    var totalTime = 5000;
    var delay = totalTime / data.length;
    var delay2 = totalTime / SEGMENTS;

    path
      .transition()
      // .delay(function(d, i) { return i * delay; })
      .delay(function(d, i) {
        // return (d.data.count/max)*totalTime;
        return ((d.data.count/max)*totalTime)+(i*delay);
        // return (i*delay);
        // return Math.random()*totalTime;
        // return ((i % SEGMENTS) * delay) + (Math.floor(i / SEGMENTS) * (delay * SEGMENTS));
        // return (i % SEGMENTS) * delay2;
      })
      .duration(600)
      .ease('cubic-in-out')
      // .ease('quad-out')
      .attrTween("d", animateArc);

  }

  // $('body').on('click', transitionIn);
  transitionIn();

}
