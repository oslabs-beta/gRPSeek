const hash = require('crypto');

// To generate a label if one is not provided by user
function hashCall(stub, message, interval) {
  return hash.createHash('sha256')
    .update(stub.toString() + JSON.stringify(message) + interval.toString())
    .digest('hex');
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

    return this;
  }

  start(labels: Array<string>): void {
    labels.forEach((label) => {
      // Check that call is not already active
      if (!this.active[label]) {
        // The associated this.calls object for the current label
        const call = this.calls[label];

        // Set a recursive timeout
        function repeatCall() {
          call.stub(call.message);
          call.timeout = setTimeout(repeatCall, call.interval);
        }
        repeatCall();

        // Add to active calls tracker
        this.active[label] = call;
      }
    })
  }

  stop(labels: Array<string>): void {
    labels.forEach((label) => {
      clearTimeout(this.active[label].timeout);
      delete this.active[label];
    })
  }

  stopAll() {
    for (const label in this.active) {
      clearTimeout(this.active[label].timeout);
      delete this.active[label];
    }
  }

}

module.exports = LoadTestEngine;