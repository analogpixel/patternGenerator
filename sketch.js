var svgCanvas;
var patternSize = 600;
var cx = patternSize /2;
var cy = patternSize /2;
var shapes = [];
var gui;
var current_layer = 0;
var layer_colors = ['#F0F','#FF0','#0FF'];

function Layer() {
  this.origin_x = 0;
  this.origin_y = 0;
  this.rotation_offset = 0;
  this.layer_rotation = 0;
  this.num_copies = 4;
  this.scale = 5;
  this.width = 100;
  this.height = 100;
  this.path = "M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0"
  this.pathSize = 100;
  this.r_offset = 0;
  this.fill = "#F0F";
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function init() {


  shapes.push( new Layer() );
  shapes.push( new Layer() );

  shapes[1].fill = "#FF0";

  draw();
  gui = new Gui("guidiv", shapes[current_layer], "update", [
    ['origin_y', 'slider', 1, [-800,800] ],
    ['origin_x', 'slider', 1, [-800,800] ],
    ['rotation_offset', 'slider', 1, [-360,360]],
    ['layer_rotation', 'slider', 1, [-360,360]],
    ['num_copies','slider', 1, [1,100]],
    ['scale', 'slider',  1, [1, 10]],
    ['width', 'slider', 1,  [0, 200]],
    ['height', 'slider', 1,  [0, 200]],
    ['r_offset', 'slider', 1,  [0, 200]]
  ]);
  gui.draw();
  draw_layer();
}


function draw_layer() {
  var h = "";

  // loop through layers and add them to the layers col
  shapes.forEach( (s,i) => {
    h += `<button class="layer_button" onclick="layer_update(this)" id="layer_${i}" style="background-color:${s.fill}">layer</button>`;
  });
  $("#layers").html(h);
}

function layer_update(e) {
  current_layer = parseInt(e.id.split("_")[1]);
  gui.draw();
}

function update(e) {
  console.log("event:", e.value, e.name);
  shapes[current_layer][e.name] = parseInt(e.value);
  draw();
}

function draw() {

  document.getElementById("sketch").innerHTML = "";
  svgCanvas = SVG().addTo('#sketch').size(patternSize, patternSize);


  // var path_shapes = [];
  // path_shapes.push( svgCanvas.defs().path( svg_path_shapes[0]).move(0,0).size(80,200));

  svgCanvas.circle(10).center(cx,cy);
  shapes.forEach( (s) => {
    var layer_shape = svgCanvas.defs().path( svg_path_shapes[0]).move(0,0).size(s.width, s.height);

    // get the path to place objects on
    var p = svgCanvas.defs().path( s.path).move(cx-s.pathSize/2, cy-s.pathSize/2).size(s.pathSize, s.pathSize);

    var og = svgCanvas.group(); // create a group for all the objects
    for (var i=0; i < s.num_copies; i++) {
      var j = map_range(i, 0, s.num_copies, 0, p.length()); // get the point i% into the path
      var r = map_range(i, 0, s.num_copies, 270, -90); // get the rotation angle of this
      var point = p.pointAt(j);
      //svgCanvas.rect(10,5).center(point.x, point.y).rotate(r+s.r_offset);
      //svgCanvas.use(path_shapes[0]).move(point.x,point.y);
      og.use(layer_shape).move(point.x-(s.width/2), point.y-(s.height/2)).rotate(r + s.r_offset).fill(s.fill).dmove(-s.origin_x, -s.origin_y);
    }
    og.rotate(s.layer_rotation).scale(s.scale*.10); 
  });

  
}

window.onload = init;
