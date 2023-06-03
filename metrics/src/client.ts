import { createChannel, createClient, ClientFactory, createClientFactory } from "nice-grpc";
import { ChatServiceClient, ChatServiceDefinition } from "../proto/chat";
import { prometheusClientMiddleware } from "nice-grpc-prometheus";

const channel = createChannel('localhost:8080');

const clientFactory = createClientFactory()
    .use(prometheusClientMiddleware())

const client: ChatServiceClient = clientFactory.create(ChatServiceDefinition, channel);

//unary call here:
const unaryCall = async() => {
    const response = await client.sendChat({name: 'jackson', message:'hello world'})
    console.log(response)
}

unaryCall();

channel.close();