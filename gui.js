class Gui {

  constructor(div_id, in_vars, update_function, gui_config) {
    this.div_id = div_id;
    this.update_function = update_function;
    this.gui_config = gui_config;
    this.in_vars = in_vars;
  }

  draw() {
    var h = "";
    this.gui_config.forEach( (config) => {
      switch (config[1]) {
        case "slider":
          h += `${config[0]}:<input type=range min="${config[3][0]}" max="${config[3][1]}" value="${this.in_vars[config[0]]}" name="${config[0]}" onInput="${this.update_function}(this)">`;

        break;
        default:
          console.log("no gui element");
      }
    });

    // console.log(h); 
    $("#" + this.div_id).html(h);
  }

}

