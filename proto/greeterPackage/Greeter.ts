// Original file: proto/helloworld.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { HelloReply as _greeterPackage_HelloReply, HelloReply__Output as _greeterPackage_HelloReply__Output } from '../greeterPackage/HelloReply';
import type { HelloRequest as _greeterPackage_HelloRequest, HelloRequest__Output as _greeterPackage_HelloRequest__Output } from '../greeterPackage/HelloRequest';

export interface GreeterClient extends grpc.Client {
  SayHello(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _greeterPackage_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHello(argument: _greeterPackage_HelloRequest, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _greeterPackage_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHello(argument: _greeterPackage_HelloRequest, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  
  SayHelloAgain(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHelloAgain(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHelloAgain(argument: _greeterPackage_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  SayHelloAgain(argument: _greeterPackage_HelloRequest, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHelloAgain(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHelloAgain(argument: _greeterPackage_HelloRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHelloAgain(argument: _greeterPackage_HelloRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  sayHelloAgain(argument: _greeterPackage_HelloRequest, callback: grpc.requestCallback<_greeterPackage_HelloReply__Output>): grpc.ClientUnaryCall;
  
}

export interface GreeterHandlers extends grpc.UntypedServiceImplementation {
  SayHello: grpc.handleUnaryCall<_greeterPackage_HelloRequest__Output, _greeterPackage_HelloReply>;
  
  SayHelloAgain: grpc.handleUnaryCall<_greeterPackage_HelloRequest__Output, _greeterPackage_HelloReply>;
  
}

export interface GreeterDefinition extends grpc.ServiceDefinition {
  SayHello: MethodDefinition<_greeterPackage_HelloRequest, _greeterPackage_HelloReply, _greeterPackage_HelloRequest__Output, _greeterPackage_HelloReply__Output>
  SayHelloAgain: MethodDefinition<_greeterPackage_HelloRequest, _greeterPackage_HelloReply, _greeterPackage_HelloRequest__Output, _greeterPackage_HelloReply__Output>
}
