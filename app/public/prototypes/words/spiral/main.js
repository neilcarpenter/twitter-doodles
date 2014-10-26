var SAMPLE_SIZE = 100;

var r1, r2, r3, tweetsRaw, tweetsData, tweetsSample;

var width = 700,
  height = 700,
  padding = 15,
  num_axes = 8,
  tick_axis = 1,
  start = 0,
  end = 8;

var CHARS_TARGET = 200;
var MAX_TEXT_SIZE_TARGET = 50;
var MIN_TEXT_SIZE_TARGET = 15;
var SPACE = 5;

var COLORS = [
  '#53ABEE',
  '#4F95CB',
  '#4B80A9',
  '#486B86',
];

var textPaths = [];

var svg;

var data;

var wordsUsed = 0;
var charsUsed;

var $refresh = $('#refresh');

r1 = $.getJSON("../../data/1000/tweetsSample.json", function(data) { tweetsSample = data; });

$.when(r1).done(init);

function init() {

  buildViz();

  // var onResize = _.debounce(reset, 300);
  // $(window).on('resize', onResize);
  $refresh.on('click', onNextClick);

}

function buildViz() {

  charsUsed = 0;

  data = [];
  tweetsSample.words.counted.count.splice(0, wordsUsed);

  tweetsSample.words.counted.count.some(function(word, i) {

    data.push(word);
    wordsUsed++;
    charsUsed+=word.word.length;

    if (charsUsed >= CHARS_TARGET) return true;

  });

  textSizes = getTextSizes(charsUsed);

  var radius = d3.scale.pow().exponent(0.7)
    .domain([end, start])
    .range([0, d3.min([width,height])/2-20]);

  var angle = d3.scale.linear()
    .domain([0,num_axes])
    .range([0,360]);

  svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height);

  var g = svg.append("g")
      .attr("transform", "translate(" + width/2 + "," + (height/2+8) +")");

  var pieces = d3.range(start, end+0.001, (end-start)/1000);

  var spiral = d3.svg.line.radial()
    .interpolate("cardinal")
    .angle(theta)
    .radius(radius);

  var spiralPath = g.selectAll(".spiral")
      .data([pieces])
    .enter().append("path")
      .attr("class", "spiral")
      .attr("d", spiral)
      .attr("id", "path1")
      .attr("transform", function(d) { return "rotate(-" + 60 + ")"; });

  var spiralPathLength = spiralPath.node().getTotalLength();

  var text = g.append("text")
    .attr("id","textWrap");

  var colorFn = randomColor;

  data.forEach(function(d, i) {

    // console.log(d, i);

    var size = textSizes.max - (i / (SAMPLE_SIZE-1))*(textSizes.max-textSizes.min);
    var space = size / 2;
    space = SPACE;

    var offset, targetOffset, prevNode, prevNodeLen, prevNodeStart;

    if (textPaths.length) {
      prevNode = textPaths[i-1].node();
      prevNodeLen = prevNode.getComputedTextLength();
      prevNodeStart = parseFloat($(prevNode).data('offset'), 10);
      // console.log(prevNode, prevNodeLen, prevNodeStart);
      targetOffset = ((prevNodeLen + space) / spiralPathLength) + prevNodeStart;
    } else {
      targetOffset = 0;
    }

    var textPath = text.append("textPath")
      .attr("id","text1")
      .attr("xlink:href","#path1")
      .text(d.word.toLowerCase())
      .attr("text-anchor", "start")
      .attr("startOffset", targetOffset-0.01)
      .attr("data-offset", targetOffset)
      .attr("data-size", size)
      .style({'font-size': size+'px', 'fill': colorFn(i), 'opacity': 0});

    textPaths.push(textPath);

  });

  data.forEach(function(d, i) {

    textPaths[i].style({'font-size': '0px'});

  });

  scaleViz();
  transitionIn();

}

function scaleViz() {

  var smallest = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerWidth;
  var minWidth = (width+(2*padding));
  var scale;

  if (smallest < minWidth) {
    scale = smallest / minWidth;
    $(svg.node()).css({'transform': 'translate(-50%, -50%) scale('+scale+')'});
  } else {
    $(svg.node()).css({'transform': 'translate(-50%, -50%)'});
  }

}

function getTextSizes(charCount) {

  return {
    max : (CHARS_TARGET / charCount) * MAX_TEXT_SIZE_TARGET,
    min : (CHARS_TARGET / charCount) * MIN_TEXT_SIZE_TARGET,
  };

}

function reset() {

  textPaths = [];
  svg.remove();

  buildViz();

}

function theta(r) {
  // console.log(r);
  return 2*Math.PI*r;
}

function randomColor(i) {

  return COLORS[i % COLORS.length];

}

function progressiveColor(i) {

  return 'hsla(0, 72%, 29%, ' + (1-(i/SAMPLE_SIZE)) + ')';

}

function transitionIn() {

  var totalTime = 70 * data.length;
  var delay = totalTime / data.length;
  var singleDuration = 700;
  var showBtnDelay = 3000;

  textPaths.forEach(function(d, i) {

    // console.log(d, i);

    d
      .transition()
      .delay(function(d) { return i * delay; })
      .duration(singleDuration)
      .ease('cubic-in-out')
      .attr("startOffset", $(d.node()).data('offset'))
      .style({'font-size': $(d.node()).data('size')+'px', 'opacity': 1});

  });

  setTimeout(function() {
    $refresh.addClass('show');
  }, (((delay*data.length)+singleDuration)+showBtnDelay));

}

function transitionOut(cb) {

  var totalTime = 70 * data.length;
  var delay = totalTime / data.length;
  var singleDuration = 700;

  textPaths.forEach(function(d, i) {

    d
      .transition()
      .delay(function(d) {
        return (i*delay);
      })
      .duration(singleDuration)
      .ease('cubic-in-out')
      .attr("startOffset", $(d.node()).data('offset')-0.01)
      .style({'font-size': '0px', 'opacity': 0});

  });

  setTimeout(cb, ((delay*data.length)+singleDuration));

}

function onNextClick() {

  $refresh.removeClass('show');
  setTimeout(function(){
    transitionOut(reset);
  }, 1500);

}
