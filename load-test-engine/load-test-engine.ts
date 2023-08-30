const hash = require('crypto');

// Generates a label if one is not provided by user
function hashCall(stub, message, interval) {
  return hash.createHash('sha256')
    .update(stub.toString() + JSON.stringify(message) + interval.toString())
    .digest('hex');
}

// Recursive setTimeout for repeating calls
function repeatCall(call) {
  call.stub(call.message);
  call.timeout = setTimeout(() => {repeatCall(call)}, call.interval);
}

type stub = {
  stub: (arg: any) => any,
  message: Record<string, any>,
  interval: number,
  timeout: NodeJS.Timeout | undefined,
}

class LoadTestEngine {
  private calls: Record<string, stub>
  private active: Record<string, stub>
  
  constructor() {
    this.calls = {};
    this.active = {};
  }

  addCall(stub: (arg: any) => any, message: Record<string, any>, interval: number, label: string = hashCall(stub, message, interval), timeout: NodeJS.Timeout | undefined): LoadTestEngine {
    if (this.calls[label]) {
      throw new Error('Label already exists.');
    }
    this.calls[label] = {
      stub,
      message,
      interval,
      timeout
    }
    console.log(`Call ${label} added.`);
    return this;
  }

  removeCall(label): void {
    if (this.calls[label]) {
      delete this.calls[label];
      console.log(`Call ${label} removed`);
    } else {
      throw new Error('Label does not exist.')
    }
  }

  getLabels(): Array<string> {
    return Object.keys(this.calls);
  }

  start(labels: Array<string>): void {
    labels.forEach((label) => {
      // Check that call is not already active
      if (!this.active[label]) {
        // The associated this.calls object for the current label
        const call = this.calls[label];
        // Set a recursive timeout
        repeatCall(call);
        console.log(`Call ${label} started.`);
        // Add to active calls tracker
        this.active[label] = call;
      }
    })
  }

  startAll(): void {
    console.log(`Starting all calls.`);
    for (const label in this.calls) {
      if (!this.active[label]) {
        const call = this.calls[label];
        repeatCall(call);
        console.log(`Call ${label} started.`);
        this.active[label] = call;
      }
    }
  }

  stop(labels: Array<string>): void {
    labels.forEach((label) => {
      clearTimeout(this.active[label].timeout);
      delete this.active[label];
      console.log(`Call ${label} stopped.`);
    })
  }

  stopAll(): void {
    if (!Object.keys(this.active).length) {
      throw new Error('No active calls.')
    }
  
    for (const label in this.active) {
      clearTimeout(this.active[label].timeout);
      delete this.active[label];
      console.log(`Call ${label} stopped.`);
    }
    console.log('All active calls stopped.');
  }

}

module.exports = LoadTestEngine;