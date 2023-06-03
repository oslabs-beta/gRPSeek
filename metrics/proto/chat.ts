/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "chat";

export interface ChatRequest {
  name: string;
  message: string;
}

export interface ChatResponse {
  name: string;
  message: string;
}

function createBaseChatRequest(): ChatRequest {
  return { name: "", message: "" };
}

export const ChatRequest = {
  encode(message: ChatRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatRequest {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: ChatRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  create(base?: DeepPartial<ChatRequest>): ChatRequest {
    return ChatRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ChatRequest>): ChatRequest {
    const message = createBaseChatRequest();
    message.name = object.name ?? "";
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseChatResponse(): ChatResponse {
  return { name: "", message: "" };
}

export const ChatResponse = {
  encode(message: ChatResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatResponse {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: ChatResponse): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  create(base?: DeepPartial<ChatResponse>): ChatResponse {
    return ChatResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<ChatResponse>): ChatResponse {
    const message = createBaseChatResponse();
    message.name = object.name ?? "";
    message.message = object.message ?? "";
    return message;
  },
};

export type ChatServiceDefinition = typeof ChatServiceDefinition;
export const ChatServiceDefinition = {
  name: "ChatService",
  fullName: "chat.ChatService",
  methods: {
    sendChat: {
      name: "SendChat",
      requestType: ChatRequest,
      requestStream: false,
      responseType: ChatResponse,
      responseStream: false,
      options: {},
    },
    sendMultipleChat: {
      name: "SendMultipleChat",
      requestType: ChatRequest,
      requestStream: true,
      responseType: ChatResponse,
      responseStream: false,
      options: {},
    },
    receiveMultipleChat: {
      name: "ReceiveMultipleChat",
      requestType: ChatRequest,
      requestStream: false,
      responseType: ChatResponse,
      responseStream: true,
      options: {},
    },
  },
} as const;

export interface ChatServiceImplementation<CallContextExt = {}> {
  sendChat(request: ChatRequest, context: CallContext & CallContextExt): Promise<DeepPartial<ChatResponse>>;
  sendMultipleChat(
    request: AsyncIterable<ChatRequest>,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ChatResponse>>;
  receiveMultipleChat(
    request: ChatRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<ChatResponse>>;
}

export interface ChatServiceClient<CallOptionsExt = {}> {
  sendChat(request: DeepPartial<ChatRequest>, options?: CallOptions & CallOptionsExt): Promise<ChatResponse>;
  sendMultipleChat(
    request: AsyncIterable<DeepPartial<ChatRequest>>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ChatResponse>;
  receiveMultipleChat(
    request: DeepPartial<ChatRequest>,
    options?: CallOptions & CallOptionsExt,
  ): AsyncIterable<ChatResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
