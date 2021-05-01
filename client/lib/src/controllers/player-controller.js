import { Component } from "../component.js";
import { vectorNorm, vectorSub } from "../util/vector.js";

export class PlayerController extends Component {


  constructor() {
    super('player-controller');
    this.speed = 0.1;

    this.canShoot = true;
  }

  update(ts) {
    if (this.parent === null) {
      return;
    }

    const rigidbody = this.parent.getComponent('rigidbody');
    const input = this.parent.getComponent('character-input');

    if (input.keys.left) {
      rigidbody.velocity[0] = -this.speed;
    } else if (input.keys.right) {
      rigidbody.velocity[0] = this.speed;
    } else {
      rigidbody.velocity[0] = 0.0;
    }

    if (input.keys.forward) {
      rigidbody.velocity[1] = -this.speed;
    } else if (input.keys.backward) {
      rigidbody.velocity[1] = this.speed;
    } else {
      rigidbody.velocity[1] = 0.0;
    }
  
    if (this.canShoot) {
      if (input.keys.space) {
        this.canShoot = false;
      
        const direction = vectorNorm(vectorSub(input.mousePosition, this.parent.position));
        this.broadcast('player.fire', { position: this.parent.position, direction: direction });
      }
    }

    if (!input.keys.space) {
      this.canShoot = true;
    }
  }
}