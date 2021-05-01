import { Component } from "../component.js";
import { vectorNorm, vectorSub } from "../util/vector.js";

export class PlayerController extends Component {
  constructor() {
    super('player-controller');
    this.speed = 0.1;

    this.canShoot = true;
    this.reloadTimer = 0;
  }

  init() {
    const network = this.parent.getComponent('network-proxy');
    this.parent.registerHandler('entity.died', (data) => {
      network.sendMessage('entity.died', data);
    });
  }

  update(ts) {
    if (this.parent === null) {
      return;
    }

    const rigidbody = this.parent.getComponent('rigidbody');
    const input = this.parent.getComponent('character-input');
    const network = this.parent.getComponent('network-proxy');
    const stats = this.parent.getComponent('stats');

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
  
    if (stats.ammo > 0 && this.canShoot) {
      if (input.keys.space) {
        this.canShoot = false;
        this.reloadTimer = 0;
        stats.useAmmo();

        const direction = vectorNorm(vectorSub(input.mousePosition, this.parent.position));
        this.broadcast('player.fire', { position: this.parent.position, direction: direction, id: this.parent.id });
        network.sendMessage('player.fire', { position: this.parent.position, direction: direction, id: this.parent.id });
      }
    }

    if (!input.keys.space) {
      this.canShoot = true;
    }

    this.reloadTimer += ts;
    if (this.reloadTimer >= 700.0) {
      stats.reload();
      this.reloadTimer = 0;
    }

    network.sendMessage('player.position', { position: this.parent.position });
  }
}