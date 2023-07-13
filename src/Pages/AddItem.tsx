import React, { useState, useEffect } from 'react';
// './generated/proto/ToDoServiceClientPb.ts' might have the client/service stub
import { TodoClient } from '../generated/proto/ToDoServiceClientPb';
import { TodoItem } from '../generated/proto/toDo_pb';
export default function AddItem() {
  const client = new TodoClient('http://localhost:8080');
  const req = new TodoItem();
  const sendToEnvoy = (txt: string = 'New Item :D', id: number = 1) => {
    req.setText(txt);
    req.setId(id);
    client.createTodo(req, {}, (err, resp) => {
      if (resp) {
        console.log(resp.toObject());
      } else {
        console.log('ERROR: ', err);
      }
    });
  };

  const [text, setText] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    sendToEnvoy();
  }, []);

  const handleText = (e: React.FormEvent<HTMLInputElement>): void => {
    setText(e.currentTarget.value);
    console.log(text);
  };
  const handleId = (e: React.FormEvent<HTMLInputElement>): void => {
    setId(e.currentTarget.value);
    console.log(id);
  };
  const handleSubmit = () => {
    sendToEnvoy(text, +id);
    console.log(+id);
  };

  return (
    <div>
      <h1>Add an Item to your To-Do List</h1>
      <div>
        <h3>Item:</h3>
        <input type="text" onChange={handleText} />
        <h3>ID: </h3>
        <input type="number" onChange={handleId} />
        <button onClick={handleSubmit}>Add to List</button>
      </div>
    </div>
  );
}
