const grpc = require('@grpc/grpc-js');
const PROTO_PATH = './proto/chat.proto';
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true, 
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const {chatServiceImpl} = require('./chatServiceImpl');

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const chatService = protoDescriptor.chatService;

//start gRPC server with services
(function main() {
    const server = new grpc.Server();
    
    server.addService(chatService, {
        sendChat: sendChat,
        sendMultipleChat: sendMultipleChat,
        receiveMultipleChat: receiveMultipleChat
    });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log('gRPC server started on: 0.0.0.0:50051')
    })
})();