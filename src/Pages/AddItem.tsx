import React, { useState, useEffect } from 'react';
// './generated/proto/ToDoServiceClientPb.ts' might have the client/service stub
import Item from '../client/components/Item';
import { TodoClient } from '../generated/proto/ToDoServiceClientPb';
import { TodoItem, voidNoParams } from '../generated/proto/toDo_pb';
import icon from '../../assets/icon.png';
import '../styles.css';

export default function AddItem() {
  const client = new TodoClient('http://localhost:8080');
  const req = new TodoItem();
  const sendToEnvoy = (txt: string = 'New Item', id: number = 1) => {
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
  // let object: voidNoParams.AsObject;
  const object = new voidNoParams();
  const [text, setText] = useState('');
  const [id, setId] = useState('');
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    client.readTodos(object, {}, (err, resp) => {
      const items = resp.getItemsList();
      console.log('ITEMS', items);
      // items.forEach((i) => console.log(i.getText()));
      const list = items.map((i) => {
        return <Item key={i.getId()} title={i.getText()} />;
      });
      setListItems(list);
      console.log(resp.toObject());
      if (err) {
        console.log(err);
      }
    });
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
      <div className="item-container">
        <img height="50px" src={icon} alt="" />

        <h1 className="item-title">Add an Item to your To-Do List</h1>
        <div className="inputs">
          <h3>Item:</h3>
          <input className="item-input" type="text" onChange={handleText} />
          <h3>ID: </h3>
          <input className="item-input" type="number" onChange={handleId} />
          <button className="item-button" onClick={handleSubmit}>
            Add to List
          </button>
        </div>
      </div>
      <h1>Tasks</h1>
      <div className="list-of-cards">{listItems}</div>
    </div>
  );
}
