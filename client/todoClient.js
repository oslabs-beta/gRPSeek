const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
// const packageDef = protoLoader.loadSync(path.join(__dirname,'../proto/todo.proto'),{});
const packageDef = protoLoader.loadSync('../protos/todo.proto', {});

console.log(__dirname);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
const text = process.argv[2];
// let text;
const client = new todoPackage.Todo(
  '34.83.192.83:80',
  grpc.credentials.createInsecure()
);

// 34.83.192.83:80 -> Mapped to port 80

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, response) => {
    console.log('Received from server ' + JSON.stringify(response));
  }
);

client.readTodos({}, (err, response) => {
  //  console.log("Received from server" + JSON.stringify(response))
  response.items.forEach((i) => console.log(i.id, '->', i.text));
});

const call = client.readTodosStream();
call.on('data', (item) => {
  console.log('received item from server ' + JSON.stringify(item));
});

call.on('end', (e) => console.log('server done!'));
