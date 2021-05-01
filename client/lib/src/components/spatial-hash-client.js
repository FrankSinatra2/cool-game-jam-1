'use strict';

import { Component } from "../component.js";

export class SpatialHashClient extends Component {


  constructor(spatialHashGrid, dimensions) {
    super('spatial-hash-client');

    this.grid = spatialHashGrid;
    this.dimensions = dimensions;
    this.client = null;
  }

  init() {
    this.client = this.grid.createClient(this.parent.getPosition(), this.dimensions);
    this.parent.registerHandler('entity.move', (data) => this.onParentMove(data));
  }

  render(ctx) {
    ctx.fillStyle = 'purple';
    ctx.fillRect(this.client.position[0], this.client.position[1], this.client.dimensions[0], this.client.dimensions[1]);
  }

  onParentMove(data) {
    this.client.position = data.newPosition;
    this.grid.updateClient(this.client);
  }
}
