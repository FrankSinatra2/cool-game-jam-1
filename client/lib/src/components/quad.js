'use strict';

import { Component } from "../component.js";

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
    ctx.fillRect(position[0], position[1], this.width, this.height);
  }
}

