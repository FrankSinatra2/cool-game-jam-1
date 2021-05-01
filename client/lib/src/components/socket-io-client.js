import 'https://cdn.jsdelivr.net/npm/socket.io-client@3.1.0/dist/socket.io.js';

import { Component } from "../component.js";
import { config } from "../config.js";

export class SocketIoClient extends Component {

  constructor() {
    super('socket-io-client');

    this.id = null;
    this.socket = null;
  }

  init() {
    this.socket = io(config.websocket.url, {
      reconnection: false,
      transport: ['websocket'],
      timeout: 10000
    });

    this.socket.on('connect', () => {
      this.broadcast('player.connected', { id: this.socket.id });
    });

    this.socket.on('disconnect', () => {
      this.broadcast('player.disconnected', { id: this.socket.id });
    });

    this.socket.onAny((topic, data) => {
      this.onMessage(topic, data);
    });
  }

  onMessage(topic, data) {
    this.broadcast(topic, data);
  }
}