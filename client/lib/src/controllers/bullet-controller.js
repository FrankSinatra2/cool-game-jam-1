import { Component } from "../component.js";
import * as v from "../util/vector.js";

export class BulletController extends Component {

  constructor(initiatorId) {
    super('bullet-controller');
    this.initiatorId = initiatorId;
  }

  update(ts) {
    if (this.parent === null) {
      return;
    }

    const gridClient = this.parent.getComponent('spatial-hash-client');


    // because time
    const nearby = this.parent.parent.children;

    for (const other of nearby) {
      if (v.vectorLength(v.vectorSub(this.parent.position, other.position)) < 15.0) {
        if (['bullet'].includes(other.tag) || other.id === this.initiatorId) {
          continue;
        }

        this.broadcast('entity.collide', { initiator: this.parent, target: other });
      }
    }
  }
}
