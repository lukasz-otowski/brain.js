'use strict';

import Base from './base';
import makeKernel from '../utilities/make-kernel';
import { activate, derivative } from '../activation/leaky-relu';

export default class LeakyRelu extends Base {
  constructor(inputLayer, settings) {
    super(settings);
    this.inputLayer = inputLayer;
  }
  setupKernels() {
    this.predictKernel = makeKernel(predict, {
      functions: [activate]
    });

    this.learnKernel = makeKernel(learn, {
      functions: [derivative]
    });
  }

  predict() {
    this.outputs = this.predictKernel(this.inputLayer.outputs);
  }

  learn() {
    this.deltas = this.learnKernel(this.weights, this.deltas);
  }
}

export function predict(inputs) {
  return activate(inputs[this.thread.y][this.thread.x]);
}

export function learn(weights, deltas) {
  return derivative(weights[this.thread.y][this.thread.x], deltas[this.thread.y][this.thread.x]);
}