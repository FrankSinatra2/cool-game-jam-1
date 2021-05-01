'use strict';

import { Component } from "../component.js";
import { config } from "../config.js";

export class ProfileWebComponent extends Component {


  constructor(id, color) {
    super(`profile`);
    
    this.id = id;
    this.color = color;
    this.element = null;
  }

  delete() {
    document.getElementById('profile-list')
      .removeChild(document.getElementById(this.id));
  }

  init() {
    this.element = createProfileComponent(this.id, this.color);
    document.getElementById('profile-list').appendChild(this.element);
  }

  updateHealthbar(healthPercent) {
    const element = document.getElementById(this.id);

    const healthbar = element.querySelector('.health-bar');
    healthbar.style.width = `${healthPercent}%`;
  }

  updateAmmobar(ammoPercent) {
    const element = document.getElementById(this.id);

    const ammobar = element.querySelector('.ammo-bar');
    ammobar.style.width = `${ammoPercent}%`;
  }
}

const createProfileComponent = (id, color) => {
  console.log(`color ${color}`);
  const playerProfile = document.createElement('div');
  const playerProfilePicture = document.createElement('div');

  const playerStats = document.createElement('div');
  const healthStat = createProfileStat('health', 'Health');
  const ammoStat = createProfileStat('ammo', 'Ammo');

  playerProfile.classList.add('player-profile');
  playerProfilePicture.classList.add('player-profile-picture');
  playerProfilePicture.style.background = color;
  playerStats.classList.add('player-stats');

  playerProfile.setAttribute("id", `${id}`);

  playerStats.appendChild(healthStat);
  playerStats.appendChild(ammoStat);

  playerProfile.appendChild(playerProfilePicture);
  playerProfile.appendChild(playerStats);

  return playerProfile;
};

const createProfileStat = (type, labelText) => {
  const stat = document.createElement('div');
  const label = document.createElement('div');
  const bar = document.createElement('div');

  stat.classList.add(`player-profile-${type}`);
  label.classList.add(`${type}-label`);
  bar.classList.add(`${type}-bar`);

  label.innerHTML = labelText;

  stat.appendChild(label);
  stat.appendChild(bar);

  return stat;
};


