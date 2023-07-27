import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { TodoClient as _todoPackage_TodoClient, TodoDefinition as _todoPackage_TodoDefinition } from './todoPackage/Todo';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  todoPackage: {
    Todo: SubtypeConstructor<typeof grpc.Client, _todoPackage_TodoClient> & { service: _todoPackage_TodoDefinition }
    TodoItem: MessageTypeDefinition
    TodoItems: MessageTypeDefinition
    voidNoParams: MessageTypeDefinition
  }
}

