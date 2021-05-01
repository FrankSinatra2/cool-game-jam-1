import { Component } from "../component.js";


export const MAX_AMMO = 5;
export const MAX_HEALTH = 3;

export class StatsComponent extends Component {
  constructor() {
    super('stats');

    this.health = MAX_HEALTH;
    this.ammo = MAX_AMMO;
  }

  healthPercent() {
    return this.health / MAX_HEALTH * 100.0;
  }

  ammoPercent() {
    return this.ammo / MAX_AMMO * 100.0;
  }

  takeDamage() {
    if (this.health > 0) {
      this.health -= 1;
      this.broadcast('entity.damage', { health: this.health, percent: this.healthPercent() });
      
      if (this.health === 0) {
        this.broadcast('entity.died', { entity: this.parent });
      }
    }
  }

  useAmmo() {
    if (this.ammo > 0) {
      this.ammo -= 1;  
      this.broadcast('entity.ammo', { ammo: this.ammo, percent: this.ammoPercent() });
    }
  }

  reload() {
    if (this.ammo <= MAX_AMMO) {
      this.ammo += 1;  
      this.broadcast('entity.ammo', { ammo: this.ammo, percent: this.ammoPercent() });
    }
  }
}