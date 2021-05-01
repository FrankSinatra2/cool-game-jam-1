'use strict';

import { Entity } from "./entity.js"
import { QuadComponent } from "./components/quad.js";
import { CharacterInput } from "./components/character-input.js";
import { Rigidbody } from "./components/rigidbody.js";
import { PlayerController } from "./controllers/player-controller.js";
import { BulletController } from "./controllers/bullet-controller.js";
import { vectorScale } from "./util/vector.js";
import { SpatialHashClient } from "./components/spatial-hash-client.js";
import { SpatialHashGrid } from "./spatial-hash-grid.js";
import { config } from "./config.js";
import { ProfileWebComponent } from "./web-component/profile.js";
import { SocketIoClient } from "./components/socket-io-client.js";
import { NetworkProxy } from "./components/network-proxy.js";
import { StatsComponent } from "./components/stats.js";
import { ProfileController } from "./controllers/profile-controller.js";

window.addEventListener('load', () => {
  const canvas = document.getElementById('game-canvas');
  canvas.width = config.canvas.width;
  canvas.height = config.canvas.height;

  const ctx = canvas.getContext('2d');

  let previousRAF = null;


  const bounds = [
    vectorScale([-canvas.width, -canvas.height], 0.5),
    vectorScale([canvas.width, canvas.height], 0.5)
  ];
  const dimensions = [ 50, 50 ];
  const grid = new SpatialHashGrid(bounds, dimensions);

  const root = new Entity('root');
  const ioClient = new SocketIoClient();

  // root.addChild(createPlayer(canvas, grid, [0, 0]));

  root.registerHandler('player.fire', (data) => {
    console.log('player.fire');
    console.log(data);
    const bullet = createBullet(data.position, data.direction, grid, data.id);
    bullet.init();
    root.addChild(bullet);
  });
  
  root.registerHandler('spawn.player', (data) => {
    const player = createPlayer(canvas, grid, data.position, data.id, data.color);
    player.init();

    root.addChild(player);
  });

  root.registerHandler('player.spawned', (data) => {
    
    const player = createNetworkPlayer(grid, data.position, data.id, data.color);
    // player.init();

    if (root.children.some(x => x.id === data.id)) {
      return;
    };

    player.init();
    root.addChild(player);
  });

  root.registerHandler('player.disconnected', (data) => {
    const player = root.children.find(x => {
      return x.id === data.id;
    });

    if (player) {
      root.children.splice(player, 1);
      player.delete();
    }
  })

  root.registerHandler('network.player.fire', (data) => {
    ioClient.socket.emit('player.fire', data);
  });

  root.registerHandler('network.player.position', (data) => {
    ioClient.socket.emit('player.position', data);
  });

  root.registerHandler('network.player.stats', (data) => {
    ioClient.socket.emit('player.stats', data);
  })

  root.registerHandler('player.position', (data) => {
    for (const child of root.children) {
      const network = child.getComponent('network-proxy');
      if (network && network.id === data.id) {
        const oldPosition = child.position;
        const newPosition = data.position;

        child.position = newPosition;
        child.broadcast('entity.move', { oldPosition, newPosition });
        break;
      } 
    }
  });

  root.registerHandler('player.stats', (data) => {
    
    for (const child of root.children) {
      const network = child.getComponent('network-proxy');
      const stats = child.getComponent('stats');
      
      if (network && stats && network.id === data.id) {
        if (data.health) {
          stats.health = data.health;
        }

        if (data.ammo) {
          stats.ammo = data.ammo;
        }

        // const oldPosition = child.position;
        // const newPosition = data.position;

        // child.position = newPosition;
        // child.broadcast('entity.move', { oldPosition, newPosition });
        break;
      } 
    }
  });

  root.registerHandler('entity.collide', (data) => {
    const player = data.target;
    const stats = player.getComponent('stats');

    if (!stats) return;

    stats.takeDamage();
    root.children.splice(root.children.indexOf(data.initiator), 1);
    data.initiator.delete();
  });

  root.registerHandler('entity.died', (data) => {
    const entity = data.entity;
    root.children.splice(root.children.indexOf(entity), 1);
    entity.delete();
  });

  root.registerHandler('network.entity.died', (data) => {
    const player = root.children.find(x => {
      const network = x.getComponent('network-proxy');

      return network && network.id === data.id;
    });

    if (player) {
      root.children.splice(player, 1);
      player.delete();
    }
  });


  root.addComponent(ioClient);

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

const createPlayer = (canvas, grid, position, id, color) => {
  const player = new Entity('player');
  player.position = position;
  player.id = id;
  player.addComponent(new QuadComponent(50, 50, color));
  player.addComponent(new CharacterInput(canvas));
  player.addComponent(new Rigidbody());
  player.addComponent(new PlayerController());
  player.addComponent(new SpatialHashClient(grid, [20, 20]));
  player.addComponent(new ProfileWebComponent(id, color));
  player.addComponent(new NetworkProxy(id));
  player.addComponent(new StatsComponent());
  player.addComponent(new ProfileController());
  return player;
};

const createNetworkPlayer = (grid, position, id, color) => {
  const player = new Entity('network-player');
  player.position = position;
  player.id = id;
  player.addComponent(new QuadComponent(50, 50, color));
  player.addComponent(new SpatialHashClient(grid, [20, 20]));
  player.addComponent(new ProfileWebComponent(id, color));
  player.addComponent(new NetworkProxy(id));
  player.addComponent(new StatsComponent());
  player.addComponent(new ProfileController());
  return player;
};

const createBullet = (position, direction, grid, initiatorId) => {
  const color = (['green', 'red', 'blue', 'magenta'])[Math.floor(Math.random() * 4)];
  const bullet = new Entity('bullet');
  bullet.position = position;
  bullet.addComponent(new QuadComponent(30, 30, color));
  bullet.addComponent(new SpatialHashClient(grid, [20, 20]));

  const rigidbody = new Rigidbody();
  rigidbody.velocity = vectorScale(direction, 0.1);

  bullet.addComponent(rigidbody);

  bullet.addComponent(new BulletController(initiatorId));
  
  return bullet;
};


