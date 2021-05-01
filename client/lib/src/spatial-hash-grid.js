import { clamp } from "./util/math.js";

export class SpatialHashGrid {
  
  constructor(bounds, dimensions) {
    const [x, y] = dimensions;
    this.cells = new Map();
    this.bounds = bounds;
    this.dimensions = dimensions;
    this.clientIds = 0;
  }

  getCellIndex(position) {
    const x = clamp((position[0] - this.bounds[0][0]) / (this.bounds[1][0] - this.bounds[0][0]), 0.0, 1.0);
    const y = clamp((position[1] - this.bounds[0][1]) / (this.bounds[1][1] - this.bounds[0][1]), 0.0, 1.0);

    const xIndex = Math.floor(x * (this.dimensions[0] - 1));
    const yIndex = Math.floor(y * (this.dimensions[1] - 1));

    return [xIndex, yIndex];
  }

  createKey(cellIndex) {
    return `${cellIndex[0]}.${cellIndex[1]}`;
  }

  createClient(position, dimensions) {
    const client = {
      position: position,
      dimensions: dimensions,
      indicies: null
    };

    this.insertClient(client);

    return client;
  }

  updateClient(client) {
    this.removeClient(client);
    this.insertClient(client);
  }

  removeClient(client) {
    const [i1, i2] = client.indices;
  
    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this.createKey([x, y]);

        this.cells[k].delete(client);
      }
    }
  }

  insertClient(client) {
    const [x, y] = client.position;
    const [w, h] = client.dimensions;

    const i1 = this.getCellIndex([x - w / 2, y - h / 2]);
    const i2 = this.getCellIndex([x + w / 2, y + h / 2]);

    client.indices = [i1, i2];

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this.createKey([x, y]);
        if (!(k in this.cells)) {
          this.cells[k] = new Set();
        }
        this.cells[k].add(client);
      }
    }
  }

  findNearby(position, dimensions) {
    const [x, y] = position;
    const [w, h] = dimensions;

    const i1 = this.getCellIndex([x - w / 2, y - h / 2]);
    const i2 = this.getCellIndex([x + w / 2, y + h / 2]);

    const clients = new Set();

    for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
      for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
        const k = this.createKey([x, y]);

        if (k in this.cells) {
          for (let v of this.cells[k]) {
            clients.add(v);
          }
        }
      }
    }
    return clients;
  }
}