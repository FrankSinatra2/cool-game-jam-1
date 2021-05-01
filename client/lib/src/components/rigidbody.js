'use strict';

import { Component } from "../component.js";
import { vectorAdd, vectorScale, vectorEqual } from "../util/vector.js";

export class Rigidbody extends Component {


  constructor() {
    super('rigidbody');

    this.acceleration = [0, 0];
    this.velocity = [0, 0];
  }

  update(ts) {
    if (this.parent === null) {
      return;
    }

    this.velocity = vectorAdd(this.velocity, vectorScale(this.acceleration, ts));
    
    const oldPosition = this.parent.position;
    this.parent.position = vectorAdd(this.parent.position, vectorScale(this.velocity, ts))

    if (!vectorEqual(oldPosition, this.parent.position)) {
      this.broadcast('entity.move', { oldPosition: oldPosition, newPosition: this.parent.position });
    }
  }
}