var fill = d3.scale.category20b();

var w = 600,
    h = 400;

var words = [],
    max = 250,
    scale = 1,
    complete = 0,
    tags,
    fontSize,
    maxLength = 30;

var layout = d3.layout.cloud()
    .timeInterval(10)
    .size([w, h])
    .fontSize(function(d) { return fontSize(+d.value); })
    .text(function(d) { return d.key.toLowerCase(); })
    .rotate(function(d) { return ~~(Math.random()) * 90;})
    .on("end", draw);

var svg = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h);

var background = svg.append("g"),
    vis = svg.append("g")
    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

function parseText(text) {
  words = [];
  tags = d3.entries(text).sort(function(a, b) { return b.value - a.value; });
  generate();
}

function generate() {
  // layout operations
  layout.font("impact") // select font
  layout.spiral("archimedean"); // rectangular or archimedean
  fontSize = d3.scale["log"]().range([10, 100]); // log, sqrt or linear

  // scale the font size according to values in the tags array
  if (tags.length) fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);

  // restarting generation, progress is 0
  complete = 0;

  // empty the array of words for drawing
  words = [];

  // stop the layout operation, grab the top "max" tags, and start the layout with them
  layout.stop().words(tags.slice(0, 250)).start(); //max = Math.min(tags.length, max))).start();
}

function draw(data, bounds) {

  scale = bounds ? Math.min(
      w / Math.abs(bounds[1].x - w / 2),
      w / Math.abs(bounds[0].x - w / 2),
      h / Math.abs(bounds[1].y - h / 2),
      h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

  words = data;

  var text = vis.selectAll("text")
      .data(words, function(d) { return d.text.toLowerCase(); });

  text.transition()
     .duration(1000)
      .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
      .style("font-size", function(d) { return d.size + "px"; });

  text.enter().append("text")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
      .style("font-size", function(d) { return d.size + "px"; })
      .on("click", function(d) {
        console.log(d + ' clicked');
        // here's where to do cleverer stuff with the cloud
        // click text here
      })
      .style("opacity", 1e-6).transition().duration(1000).style("opacity", 1); // fade the wordle in nicely
  text.style("font-family", function(d) { return d.font; })
      .style("fill", function(d) { return fill(d.text.toLowerCase());})
      .text(function(d) { return d.text.toLowerCase(); });
  var exitGroup = background.append("g")
      .attr("transform", vis.attr("transform"));
  var exitGroupNode = exitGroup.node();
  text.exit().each(function() {
    exitGroupNode.appendChild(this);
  });
  exitGroup.transition()
      .duration(1000)
      .style("opacity", 1e-6)
      .remove();
  vis.transition()
      .delay(1000)
      .duration(750)
      .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");
}

// Converts a given word cloud to image/png.
function downloadPNG() {
  var canvas = document.createElement("canvas"),
      c = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  c.translate(w >> 1, h >> 1);
  c.scale(scale, scale);
  words.forEach(function(word, i) {
    c.save();
    c.translate(word.x, word.y);
    c.rotate(word.rotate * Math.PI / 180);
    c.textAlign = "center";
    c.fillStyle = fill(word.text.toLowerCase());
    c.font = word.size + "px " + word.font;
    c.fillText(word.text, 0, 0);
    c.restore();
  });
  d3.select(this).attr("href", canvas.toDataURL("image/png"));
}

function downloadSVG() {
  d3.select(this).attr("href", "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(
    svg.attr("version", "1.1")
       .attr("xmlns", "http://www.w3.org/2000/svg")
     .node().parentNode.innerHTML))));
}
