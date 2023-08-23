import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/helloworld';

const PORT = 8082;
const PROTO = '../proto/helloworld.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO));
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType;
const greeterPackage = grpcObj.greeterPackage;

const client = new grpcObj.greeterPackage.Greeter(
  `0.0.0.0:${PORT}`, grpc.credentials.createInsecure(),
)

function main () {
  client.SayHello({name:"Kenny"}, (err, res)=> {
    if(err){
      console.log('error', err)
      return;
    }
    console.log("result:", res)
  })
}
main()