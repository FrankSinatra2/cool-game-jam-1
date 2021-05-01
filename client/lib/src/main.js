'use strict';

import { Entity } from "./entity.js"
import { QuadComponent } from "./components/quad.js";
import { CharacterInput } from "./components/character-input.js";
import { Rigidbody } from "./components/rigidbody.js";
import { PlayerController } from "./controllers/player-controller.js";
import { vectorScale } from "./util/vector.js";
import { SpatialHashClient } from "./components/spatial-hash-client.js";
import { SpatialHashGrid } from "./spatial-hash-grid.js";

window.addEventListener('load', () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let previousRAF = null;

  const bounds = [
    [0, 0],
    [canvas.width, canvas.height]
  ];
  const dimensions = [ 50, 50 ];
  const grid = new SpatialHashGrid(bounds, dimensions);

  const root = new Entity('root');

  root.addChild(createPlayer(canvas, grid));

  root.registerHandler('player.fire', (data) => {
    root.addChild(createQuad(data.position, data.direction, 50, 50));
  });
  
  const raf = () => {
    requestAnimationFrame((t) => {
      if (previousRAF === null) {
        previousRAF = t;
      }

      raf();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      root.update(t - previousRAF);
      root.render(ctx);

      previousRAF = t;
    });
  };

  root.init();
  root.update(0);
  root.render(ctx);
  raf();  
});

const createPlayer = (canvas, grid) => {
  const player = new Entity('player');
  player.addComponent(new QuadComponent(50, 50, 'yellow'));
  player.addComponent(new CharacterInput(canvas));
  player.addComponent(new Rigidbody());
  player.addComponent(new PlayerController());
  player.addComponent(new SpatialHashClient(grid, [20, 20]));
  return player;
};

const createQuad = (position, direction, width, height) => {
  const color = (['green', 'red', 'blue', 'magenta'])[Math.floor(Math.random() * 4)];
  const quad = new Entity('quad');
  quad.position = position;
  quad.addComponent(new QuadComponent(width, height, color));

  const rigidbody = new Rigidbody();
  rigidbody.velocity = vectorScale(direction, 0.1);

  quad.addComponent(rigidbody);
  
  return quad;
};


