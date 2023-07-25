// Original file: proto/toDo.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { TodoItem as _todoPackage_TodoItem, TodoItem__Output as _todoPackage_TodoItem__Output } from '../todoPackage/TodoItem';
import type { TodoItems as _todoPackage_TodoItems, TodoItems__Output as _todoPackage_TodoItems__Output } from '../todoPackage/TodoItems';
import type { voidNoParams as _todoPackage_voidNoParams, voidNoParams__Output as _todoPackage_voidNoParams__Output } from '../todoPackage/voidNoParams';

export interface TodoClient extends grpc.Client {
  createMultipleTodos(argument: _todoPackage_TodoItems, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  createMultipleTodos(argument: _todoPackage_TodoItems, metadata: grpc.Metadata, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  createMultipleTodos(argument: _todoPackage_TodoItems, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  createMultipleTodos(argument: _todoPackage_TodoItems, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  createMultipleTodos(argument: _todoPackage_TodoItems, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  createMultipleTodos(argument: _todoPackage_TodoItems, metadata: grpc.Metadata, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  createMultipleTodos(argument: _todoPackage_TodoItems, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  createMultipleTodos(argument: _todoPackage_TodoItems, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  
  createTodo(argument: _todoPackage_TodoItem, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  createTodo(argument: _todoPackage_TodoItem, metadata: grpc.Metadata, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  createTodo(argument: _todoPackage_TodoItem, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  createTodo(argument: _todoPackage_TodoItem, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  createTodo(argument: _todoPackage_TodoItem, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  createTodo(argument: _todoPackage_TodoItem, metadata: grpc.Metadata, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  createTodo(argument: _todoPackage_TodoItem, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  createTodo(argument: _todoPackage_TodoItem, callback: grpc.requestCallback<_todoPackage_TodoItem__Output>): grpc.ClientUnaryCall;
  
  readTodos(argument: _todoPackage_voidNoParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  readTodos(argument: _todoPackage_voidNoParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  readTodos(argument: _todoPackage_voidNoParams, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  readTodos(argument: _todoPackage_voidNoParams, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  readTodos(argument: _todoPackage_voidNoParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  readTodos(argument: _todoPackage_voidNoParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  readTodos(argument: _todoPackage_voidNoParams, options: grpc.CallOptions, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  readTodos(argument: _todoPackage_voidNoParams, callback: grpc.requestCallback<_todoPackage_TodoItems__Output>): grpc.ClientUnaryCall;
  
  readTodosStream(argument: _todoPackage_voidNoParams, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_todoPackage_TodoItem__Output>;
  readTodosStream(argument: _todoPackage_voidNoParams, options?: grpc.CallOptions): grpc.ClientReadableStream<_todoPackage_TodoItem__Output>;
  readTodosStream(argument: _todoPackage_voidNoParams, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_todoPackage_TodoItem__Output>;
  readTodosStream(argument: _todoPackage_voidNoParams, options?: grpc.CallOptions): grpc.ClientReadableStream<_todoPackage_TodoItem__Output>;
  
}

export interface TodoHandlers extends grpc.UntypedServiceImplementation {
  createMultipleTodos: grpc.handleUnaryCall<_todoPackage_TodoItems__Output, _todoPackage_TodoItems>;
  
  createTodo: grpc.handleUnaryCall<_todoPackage_TodoItem__Output, _todoPackage_TodoItem>;
  
  readTodos: grpc.handleUnaryCall<_todoPackage_voidNoParams__Output, _todoPackage_TodoItems>;
  
  readTodosStream: grpc.handleServerStreamingCall<_todoPackage_voidNoParams__Output, _todoPackage_TodoItem>;
  
}

export interface TodoDefinition extends grpc.ServiceDefinition {
  createMultipleTodos: MethodDefinition<_todoPackage_TodoItems, _todoPackage_TodoItems, _todoPackage_TodoItems__Output, _todoPackage_TodoItems__Output>
  createTodo: MethodDefinition<_todoPackage_TodoItem, _todoPackage_TodoItem, _todoPackage_TodoItem__Output, _todoPackage_TodoItem__Output>
  readTodos: MethodDefinition<_todoPackage_voidNoParams, _todoPackage_TodoItems, _todoPackage_voidNoParams__Output, _todoPackage_TodoItems__Output>
  readTodosStream: MethodDefinition<_todoPackage_voidNoParams, _todoPackage_TodoItem, _todoPackage_voidNoParams__Output, _todoPackage_TodoItem__Output>
}
