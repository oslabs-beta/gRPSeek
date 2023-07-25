import * as jspb from 'google-protobuf'



export class voidNoParams extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): voidNoParams.AsObject;
  static toObject(includeInstance: boolean, msg: voidNoParams): voidNoParams.AsObject;
  static serializeBinaryToWriter(message: voidNoParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): voidNoParams;
  static deserializeBinaryFromReader(message: voidNoParams, reader: jspb.BinaryReader): voidNoParams;
}

export namespace voidNoParams {
  export type AsObject = {
  }
}

export class TodoItem extends jspb.Message {
  getId(): number;
  setId(value: number): TodoItem;

  getText(): string;
  setText(value: string): TodoItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TodoItem.AsObject;
  static toObject(includeInstance: boolean, msg: TodoItem): TodoItem.AsObject;
  static serializeBinaryToWriter(message: TodoItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TodoItem;
  static deserializeBinaryFromReader(message: TodoItem, reader: jspb.BinaryReader): TodoItem;
}

export namespace TodoItem {
  export type AsObject = {
    id: number,
    text: string,
  }
}

export class TodoItems extends jspb.Message {
  getItemsList(): Array<TodoItem>;
  setItemsList(value: Array<TodoItem>): TodoItems;
  clearItemsList(): TodoItems;
  addItems(value?: TodoItem, index?: number): TodoItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TodoItems.AsObject;
  static toObject(includeInstance: boolean, msg: TodoItems): TodoItems.AsObject;
  static serializeBinaryToWriter(message: TodoItems, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TodoItems;
  static deserializeBinaryFromReader(message: TodoItems, reader: jspb.BinaryReader): TodoItems;
}

export namespace TodoItems {
  export type AsObject = {
    itemsList: Array<TodoItem.AsObject>,
  }
}

