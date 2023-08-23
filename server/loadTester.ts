import * as grpc from '@grpc/grpc-js';
import { performance } from 'perf_hooks';
import * as fs from 'fs';
import * as path from 'path';

/** Interceptor for client node server
 * For every request it calculates the length it took and status code
 */
function clientInterceptor(): grpc.Interceptor {
  return (options, nextCall) => {

    //Before the request to the server
    let startTime = performance.now();

    //executing nextCall returns an InterceptingCallInterface which is a parent class of InterceptingCall hence conversion needed
    const call = new grpc.InterceptingCall(nextCall(options));

    //After the request is finished
    let endTime = performance.now();


    //length in ms
    let timeDuration = endTime - startTime;
    fs.writeFileSync(path.join(__dirname, '../metrics/time.txt'), `Time Duration: ${timeDuration}`);

    return call;
  }
}


export default clientInterceptor