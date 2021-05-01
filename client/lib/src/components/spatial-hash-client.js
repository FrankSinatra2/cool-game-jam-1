'use strict';

import { Component } from "../component.js";
import { config } from "../config.js";

export class SpatialHashClient extends Component {


  constructor(spatialHashGrid, dimensions) {
    super('spatial-hash-client');

    this.grid = spatialHashGrid;
    this.dimensions = dimensions;
    this.client = null;
  }

  init() {
    this.client = this.grid.createClient(this.parent.getPosition(), this.dimensions, this.parent);
    this.parent.registerHandler('entity.move', (data) => this.onParentMove(data));
  }

  render(ctx) {
    ctx.fillStyle = 'purple';
    ctx.fillRect(
      this.client.position[0] - this.client.dimensions[0] / 2.0 + config.canvas.width / 2.0,
      this.client.position[1] - this.client.dimensions[1] / 2.0 + config.canvas.height / 2.0,
      this.client.dimensions[0],
      this.client.dimensions[1]
    );
  }

  delete() {
    this.grid.removeClient(this.client);
  }

  onParentMove(data) {
    this.client.position = data.newPosition;
    this.grid.updateClient(this.client);
  }
}
