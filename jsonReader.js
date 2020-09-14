var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    shapes = JSON.parse(text);
    //gui.in_vars = shapes[current_layer];
    //draw_layer();
    //draw();
    current_layer = shapes.length - 1;
    gui.in_vars = shapes[current_layer];
    gui.draw();
    draw_layer();
    draw();
  };
  reader.readAsText(input.files[0]);
};

function saveFile() {
  var fileToSave = new Blob([JSON.stringify(shapes)], {
    type: 'application/json',
    name: "project.json"
});

// Save the file
saveAs(fileToSave, "project.json");
}
