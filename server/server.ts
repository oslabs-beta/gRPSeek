import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from '../proto/toDo';
import { query as pool } from '../database/todoModel';
const PORT = 8082;
const PROTO_FILE = '../proto/todo.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(
  packageDef
) as unknown as ProtoGrpcType;
const todoPackage = grpcObj.todoPackage;

function main() {
  const server = getServer();

  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Your server as started on port ${port}`);
      server.start();
    }
  );
}

function getServer() {
  const server = new grpc.Server();

  server.addService(todoPackage.Todo.service, {
    createTodo: async (call, callback) => {
      const todoText = call.request.text;
      try {
        const result = pool(
          'INSERT into todos (text) VALUES ($1) RETURNING *',
          [todoText]
        );
        const insertedTodoItem = result.rows[0];
        console.log('New item: ', insertedTodoItem);
        callback(null, insertedTodoItem);
      } catch (error) {
        callback(error);
      }
    },
    readTodos: async (call, callback) => {
      try {
        const result = await pool('SELECT * FROM todos');
        const todoItems = result.rows;
        callback(null, { items: todoItems });
        // return result
      } catch (error) {
        console.log('Error: ', error);
      }
    },
  });
  return server;
}

main();