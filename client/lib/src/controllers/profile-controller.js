import { Component } from "../component.js";


export class ProfileController extends Component {
  constructor() {
    super('profile-controller');


  }

  init() {
    const stats = this.parent.getComponent('stats');
    const network = this.parent.getComponent('network-proxy');

    this.parent.registerHandler('entity.damage', (data) => {
      console.log('recieved damage');
      network.sendMessage('player.stats', { health: data.health });
    });

    this.parent.registerHandler('entity.ammo', (data) => {
      network.sendMessage('player.stats', { ammo: data.ammo });
    });
  }

  update(ts) {
    const stats = this.parent.getComponent('stats');
    const profile = this.parent.getComponent('profile');
    const network = this.parent.getComponent('network-proxy');

    profile.updateHealthbar(stats.healthPercent());
    profile.updateAmmobar(stats.ammoPercent());

  }
}
