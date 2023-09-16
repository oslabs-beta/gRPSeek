import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  GreeterClient as _greeterPackage_GreeterClient,
  GreeterDefinition as _greeterPackage_GreeterDefinition,
} from './greeterPackage/Greeter';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  greeterPackage: {
    Greeter: SubtypeConstructor<
      typeof grpc.Client,
      _greeterPackage_GreeterClient
    > & { service: _greeterPackage_GreeterDefinition };
    HelloReply: MessageTypeDefinition;
    HelloRequest: MessageTypeDefinition;
  };
}
