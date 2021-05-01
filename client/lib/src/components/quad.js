'use strict';

import { Component } from "../component.js";
import { config } from "../config.js";

export class QuadComponent extends Component {


  constructor(width, height, color) {
    super('quad');

    this.width = width;
    this.height = height;
    this.color = color;
  }

  update(ts) {
    
  }

  render(ctx) {
    const position = this.parent.getPosition();
    ctx.fillStyle = this.color;
    ctx.fillRect(
      position[0] - this.width / 2.0 + config.canvas.width / 2.0,
      position[1] - this.height / 2.0 + config.canvas.height / 2.0,
      this.width,
      this.height
    );
  }
}

