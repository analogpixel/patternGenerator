var svgCanvas;
var patternSize = 600;
var cx = patternSize /2;
var cy = patternSize /2;
var shapes = [];
var gui;
var current_layer = 0;
var layer_colors = ['#33A8C7','#52E3E1','#A0E426','#FDF148','#FFAB00','#F77976','#D883FF','#9336FD'];

function Layer() {
  this.origin_x = 0;
  this.origin_y = 0;
  this.rotation_offset = 0;
  this.layer_rotation = 0;
  this.num_copies = 4;
  this.scale = 50;
  this.width = 100;
  this.height = 100;
  this.path = "M-10,0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0"
  this.pathSize = 100;
  this.r_offset = 0;
  this.fill = "#F0F";
  this.layer_path = "";
  this.xflip = 0;
  this.yflip = 0;
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function newLayer() {
  var t = new Layer();
  t.fill = layer_colors[ (shapes.length % (layer_colors.length)) ];
  console.log(t.fill);
  shapes.push(t);
  current_layer = shapes.length - 1;

  gui.in_vars = shapes[current_layer];
  gui.draw();
  draw_layer();
  draw();
}

function init() {


  gui = new Gui("guidiv", shapes[current_layer], "update", [
    ['origin_y', 'slider', 1, [-1200,1200] ],
    ['origin_x', 'slider', 1, [-1200,1200] ],
    ['layer_rotation', 'slider', 1, [-360,360]],
    ['num_copies','slider', 1, [1,100]],
    ['scale', 'slider',  1, [1, 150]],
    ['width', 'slider', 1,  [1, 400]],
    ['height', 'slider', 1,  [1, 400]],
    ['r_offset', 'slider', 1,  [0, 360]]
  ]);
  //gui.draw();
  //draw_layer();
  draw_path_selector();
}

function draw_path_selector() {
  
  var pdiv = document.getElementById("paths");

  svg_path_shapes.forEach( (p,idx) => {
    var svgDiv = document.createElement("div"); 
    svgDiv.id = `path_${idx}`;
    svgDiv.onclick = function() {layer_change_shape(idx)};
    pdiv.appendChild(svgDiv);     

    var path_preview = SVG().addTo(`#path_${idx}`).size(80,80);
    path_preview.path(p).move(0,0).size(80);
  });

}

function layer_change_shape(e) {
  console.log("change shape called", e);
  shapes[current_layer].layer_path = svg_path_shapes[e]; 
  draw();
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
    //var layer_shape = svgCanvas.defs().path( svg_path_shapes[0]).move(0,0).size(s.width, s.height);
    var layer_shape = svgCanvas.defs().path( s.layer_path).move(0,0).size(s.width, s.height);

    // get the path to place objects on
    var p = svgCanvas.defs().path( s.path).move(cx-s.pathSize/2, cy-s.pathSize/2).size(s.pathSize, s.pathSize);

    var og = svgCanvas.group(); // create a group for all the objects
    for (var i=0; i < s.num_copies; i++) {
      var j = map_range(i, 0, s.num_copies, 0, p.length()); // get the point i% into the path
      var r = map_range(i, 0, s.num_copies, 270, -90); // get the rotation angle of this
      var point = p.pointAt(j);
      //svgCanvas.rect(10,5).center(point.x, point.y).rotate(r+s.r_offset);
      //svgCanvas.use(path_shapes[0]).move(point.x,point.y);

      if (i %2 == 0) {
        var flipvar = "x" ;
      } else {
        var flipvar = false;
      }

      og.use(layer_shape).move(point.x-(s.width/2), point.y-(s.height/2)).transform({flip: flipvar}).rotate(r + s.r_offset).fill(s.fill).dmove(-s.origin_x, -s.origin_y);
    }
    og.rotate(s.layer_rotation).scale(s.scale*.010); 
  });

  
}

window.onload = init;
