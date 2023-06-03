import { CallContext } from "nice-grpc";
import { ChatServiceImplementation, ChatRequest, ChatResponse, DeepPartial } from '../proto/chat'
import {delay} from 'abort-controller-x';
import { ServerError, Status } from "nice-grpc";

//define service implementation
export const chatServiceImpl: ChatServiceImplementation = {
    //unary
    async sendChat(request: ChatRequest): Promise<DeepPartial<ChatResponse>> {
        try {
            const response = {name: 'miri', message: 'goodbye world'}
            console.log(`REQ:`, request)
            return response;
            
        } catch (error) {
            throw new ServerError(Status.UNKNOWN, 'Unable to send message')
        }
    },

    //client side streaming - receives request as an "async iterable"
    async sendMultipleChat(request: AsyncIterable<ChatRequest>): Promise<DeepPartial<ChatResponse>> {
        try {
            for await (const item of request) {
                console.log(item)
            }
            const response = {name: 'kenny', message: 'meow'}
            return response;
        } catch (error) {
            throw new ServerError(Status.UNKNOWN, 'Unable to send messages')
        }
    },

    //server side streaming - should return asyncIterable
    async *receiveMultipleChat(request:ChatRequest, context: CallContext): AsyncIterable<DeepPartial<ChatResponse>> {
        try {
            /* 
            make response iterable 
            *Symbol.iterator is a 0 arg function that returns an iterable object 
            *see client side streaming ⬆️ - for of is used to iterate these asynciterables (currently not async as response is hard coded)
            */
            const response = {};
            response[Symbol.iterator] = function*() {
                yield {name: 'johnny', message: 'wheee'};
                yield {name: 'patryk', message: 'grpseeeek'};
                yield {name: 'ariel', message: 'techstack!'};
            }
            /*
            console.log(response) -> Object {}
            but!
            for(const items of response) {
                console.log(items)
            } will return:
            {name: 'johnny', message: 'wheee'}
            {name: 'patryk', message: 'grpseeeek'}
            {name: 'ariel', message: 'techstack!'}
            */
            for(let i = 0; i < 10; i++) {
                await delay(context.signal, 1000);
                yield response;
            }
        } catch (error) {
            throw new ServerError(Status.UNKNOWN, 'Unable to retrieve messages')
        }
    }
}