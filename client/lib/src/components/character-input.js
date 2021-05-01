'use strict';

import { Component } from "../component.js";
import { vectorSub } from "../util/vector.js";

export class CharacterInput extends Component {

  constructor(canvas) {
    super('character-input');

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
    };

    this.mousePosition = [0, 0];

    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    canvas.addEventListener('mousemove', (e) => {
      this.onMouseMove(canvas, e);
    });
  }


  onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 32: // SPACE
        this.keys.space = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
    }
  }

  onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 32: // SPACE
        this.keys.space = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }
  }

  onMouseMove(canvas, event) {
    const cRect = canvas.getBoundingClientRect();              // Gets the CSS positions along with width/height
    const canvasX = Math.round(event.clientX - cRect.left);        // Subtract the 'left' of the canvas from the X/Y
    const canvasY = Math.round(event.clientY - cRect.top); 
  
    this.mousePosition = vectorSub([canvasX, canvasY], [450, 300]);
  }
}


