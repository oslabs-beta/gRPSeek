import * as grpc from '@grpc/grpc-js';
import { performance } from 'perf_hooks';
import * as fs from 'fs';
import * as path from 'path';

let numCalls = 0;
let numErrors = 0;

/**
 * Client Interceptor function
 * This interceptor for every request, calculates duration and status
 */
let interceptor: grpc.Interceptor = function (options, nextCall) {
  let startTime: number;
  let endTime: number;
  //create a requestor intercepts outbound operations (start, sendMessage)
  let requestor: grpc.Requester = {
    //start method called before an outbound call has started. This is where to define listener and methods that occur with inbound operations
    start: (metadata, listener, next) => {
      //listener that intercepts inbound operations - receiving server status and message
      let newListener: grpc.Listener = {
        onReceiveMessage: (message, next) => {
          // console.log('inbound message received: ', message);
          let endTime = performance.now();
          let timeDuration = endTime - startTime;
          //duration in ms
          fs.writeFileSync(path.join(__dirname, '../metrics/time.txt'), `Time Duration: ${timeDuration}\n`, { flag: "a+" });
        },
        onReceiveStatus: (status, next) => {
          if (status.code !== grpc.status.OK) {
            numErrors++;
            console.log(`status error: ${grpc.status[status.code]} message: ${status.details}`);
            //   Potential Stretch feature: handling failed requests with a fallback method
            // } else {
            //   console.log('status ok');
            //   next(status);
          }
          next(status);
        }
      };
      next(metadata, newListener);
    },
    //sendMesssage method called before every outbound message - where we count total number of calls, time start
    sendMessage: (message, next) => {
      console.log('outbound message sent: ', message);
      startTime = performance.now();
      numCalls++;
      next(message);
    }
  }

  const call = new grpc.InterceptingCall(nextCall(options), requestor);
  return call;
}


export { interceptor, numCalls, numErrors }