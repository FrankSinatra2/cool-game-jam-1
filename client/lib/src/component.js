
export class Component {
  constructor(tag) {
    this.tag = tag;
    this.parent = null;
  }

  broadcast(topic, data) {
    if (this.parent !== null) {
      this.parent.broadcast(topic, data);
    }
  }

  init() {}
  update(ts) {}
  render(ctx) {}
}
