import { Component } from "../component.js";




export class NetworkProxy extends Component {

  constructor(id) {
    super('network-proxy');

    this.id = id;
  }


  sendMessage(topic, data) {
    this.broadcast(`network.${topic}`, Object.assign(data, { id: this.id}));
  }

}