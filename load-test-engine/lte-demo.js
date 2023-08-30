const engine = require('./load-test-engine.js');

const dummyFn1 = (message) => {
  console.log(message)
}
const dummyFn2 = (message) => {
  console.log(message)
}

engine
  .addCall(dummyFn1, {dF1Message: 'Hi!'}, 1000, 'dummy1')
  .addCall(dummyFn2, {dF2Message: 'Hello!'}, 2000, 'dummy2')
  .startAll();

setTimeout(() => {
  engine.stopAll();
  
  console.log('Calls currently stored on engine: ', engine.getLabels());

  engine
    .removeCall('dummy1')
    .removeCall('dummy2');

  console.log('Calls currently stored on engine: ', engine.getLabels());
}, 10000)