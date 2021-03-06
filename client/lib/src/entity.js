'use strict';

import { vectorAdd } from "./util/vector.js";



export class Entity {

  static id = 0;

  constructor(tag) {
    this.tag = tag;
    this.components = {};
    this.children = [];
    this.parent = null;
    this.handlers = new Map();

    // vector
    this.position = [0, 0];

    // imaginary number
    this.rotation = [0, 0];

    this.id = Math.floor(Math.random() * 100000);
  }

  getPosition() {
    if (this.parent === null) {
      return this.position;
    }

    return vectorAdd(this.position, this.parent.getPosition());
  }

  addComponent(comp) {
    comp.parent = this;
    this.components[comp.tag] = comp;
  }

  getComponent(tag) {
    return this.components[tag];
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  setParent(parent) {
    this.parent = parent;
  }

  registerHandler(topic, handler) {
    this.handlers.set(topic, handler);
  }

  broadcast(topic, data) {
    if (this.parent !== null) {
      this.parent.broadcast(topic, data);
    }

    if (this.handlers.has(topic)) {
      this.handlers.get(topic)(data);
    }
  }

  init() {
    for (const child of this.children) {
      child.init();
    }

    for (const comp of Object.values(this.components)) {
      comp.init();
    }
  }

  update(ts) {
    for (const comp of Object.values(this.components)) {
      comp.update(ts);
    }

    for (const child of this.children) {
      child.update(ts);
    }
  }

  render(ctx) {
    for (const comp of Object.values(this.components)) {
      comp.render(ctx);
    }

    for (const child of this.children) {
      child.render(ctx);
    }
  }

  delete() {
    for (const comp of Object.values(this.components)) {
      comp.delete();
    }

    for (const child of this.children) {
      child.delete();
    }
  }
}
