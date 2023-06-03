import "./App.css";
import { useCallback, useState } from "react";
import protobuf from "protobufjs";
import Tree from "./Tree";
import "./index.css";


function Treemap() {

  
  const currObj = { name: "", children: [] };
  const arrayOfMessageObjects = [];
  let once = true;

  const deepSearch = (currObj, targetMessage) => {
    for (let key in currObj) {
      if (currObj[key] === targetMessage.name) {
        currObj.children = targetMessage = targetMessage.children;
      } else if (Array.isArray(currObj[key])) {
        for (let i = 0; i < currObj[key].length; i++) {
          deepSearch(currObj[key][i], targetMessage);
        }
      }
    }

    // console.log("deepsearch is finished");
    // console.log("here is our updated currObj: ", currObj);
    return;
  };

  const printDefinitions = (object, prefix = "") => {
    //console.log('currObj: ', currObj)
    //console.log(object)

    for (let name in object.nested) {
      let nested = object.nested[name];

      //log definition itself
      // console.log('prefix.name : ', prefix + name, nested)
      if (once) {
        currObj.name = name;
        //console.log('currObj: ', currObj);
        once = false;
      }

      if (nested instanceof protobuf.Type) {
        // console.log("found a message");
        // console.log("this is message object", nested);
        const messageObj = { name: nested.name, children: [] };
        for (let fieldName in nested.fields) {
          let field = nested.fields[fieldName];
          //console.log("this is a field : ", field);
          const currField = {
            name: field.name,
            children: [{ name: field.type }],
          };
          messageObj.children.push(currField);

          // console.log('this is a message', prefix + name + '.' + fieldName, field)
          // console.log('this is name of message: ', name)
          // console.log('this is the id : ', field.id)
          // console.log('this is the name:', field.name)
          // console.log('is repeated? :', field.repeated)
          // console.log('these are options : ', field.options)
          // console.log('this is the (data) type : ' , field.type)
        }
        arrayOfMessageObjects.push(messageObj);
        // console.log(
        //   "this is array of message objects: ",
        //   arrayOfMessageObjects
        // );
        printDefinitions(nested);
      }

      if (nested instanceof protobuf.Service) {
        // console.log("found a service");
        // console.log(nested);
        //create obj for service
        const obj = {};
        obj.name = nested.name + ' (Service)';
        obj.children = [];
        // console.log("obj.name should be simpleservice: ", obj.name);
        // console.log("obj before for loop: ", obj);

        //loop through methods in service
        for (let key in nested.methods) {
          //console.log("in the for loop");
          //console.log("name of method: should be sayhello or saygoodbye: ",nested.methods[key].name);
          const methodObj = { name: nested.methods[key].name + ' (Method)', children: [] };
          //console.log("current method obj: ", methodObj);
          // console.log(
          //   "key.requesttype: should be hellorequest or helloresponse: ",
          //   nested.methods[key].requestType
          // );
          const reqObj = {
            name: nested.methods[key].requestType,
            children: [],
          };
          const resObj = {
            name: nested.methods[key].responseType,
            children: [],
          };
          methodObj.children.push(reqObj);
          methodObj.children.push(resObj);
          obj.children.push(methodObj);
          // console.log(methodObj)
          // console.log(obj)
        }
        currObj.children.push(obj);

        //console.log("this is currObj after finding a service: ", currObj);
        printDefinitions(nested);
      }

      //if its a service, log its methods
      // else if(nested instanceof protobuf.Service){
      //   for(let methodName in nested.methods){
      //     let method = nested.methods[methodName];
      //     // console.log('this is a service',prefix + name + '.' + methodName, method);
      //     // console.log('this is name of service: ', name)
      //     // console.log('this is name of method in the service: ', method.name)
      //     // console.log('this is request type of service: ', method.requestType)
      //     // console.log('this is response type of service: ', method.responseType)
      //     // console.log('type of method (most likely rpc: ', method.type)
      //     // console.log('this is requestStream (return true or false) : ' , method.requestStream)
      //     // console.log('this is responseStream (returns true of false) : ' , method.responseStream)
      //     // console.log('these are options for service:', method.options)
      //     // treeData.current.name = name;
      //     // treeData.current.children = []
      //     // treeData.current.children.push({name: method.name, children: [{name: method.requestType}, {name: method.responseType}]})
      //     // console.log('this is the method......', method)
      //     // console.log('this is the tree data', treeData.current)
      //   }
      // }
      // else if(nested instanceof protobuf.Enum){
      //   for(let valueName in nested.values){
      //     let value = nested.values[valueName];
      //     // console.log('this is an enum', prefix + name + '.' + valueName, value)
      //   }
      // }
      else if (nested.nested) {
        printDefinitions(nested, prefix + name + ".");
      }
    }

    for (let i = 0; i < arrayOfMessageObjects.length; i++) {
      deepSearch(currObj, arrayOfMessageObjects[i]);
    }

    setTimeout(() => {
      setCurrent({ ...currObj });
      setDataReady(true);
    }, 1);
  };

  const [current, setCurrent] = useState(currObj);
  const [dataReady, setDataReady] = useState(false);

  const onFileChange = (event) => {
    setCurrent({ name: "", children: [] });
    console.log("this is current state", current);
    setDataReady(false);
    const file = event.target.files[0]; //get selected file
    //console.log("this is file : ", file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result; //contents of file
      //console.log("this is contents: ", contents);

      const root = protobuf.parse(contents).root; //parse contents of file

      //console.log('this is root: ', root)

      printDefinitions(root); //assign the return value of printDefinitions to treeData.current
      // setCurrent(currObj)

      // console.log(treeData.current); //log the result
    };

    reader.readAsText(file); //read file as text
  };

  const onFileChangeCallback = useCallback((event) => {
    setCurrent({ name: "", children: [] });
    console.log("this is current state", current);
    setDataReady(false);
    const file = event.target.files[0]; //get selected file
    //console.log("this is file : ", file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target.result; //contents of file
      //console.log("this is contents: ", contents);

      const root = protobuf.parse(contents).root; //parse contents of file

      //console.log('this is root: ', root)

      printDefinitions(root); //assign the return value of printDefinitions to treeData.current
      // setCurrent(currObj)

      // console.log(treeData.current); //log the result
    };

    event.target.value = null;

    reader.readAsText(file); //read file as text
  }, []);

  return (
    <div>
      <div className="inputs">
        <label for="file-input" id="file-label">Select One .proto File</label>
        <input
          className="oneProtoFile--input"
          id="file-input"
          type="file"
          accept=".proto"
          title=" "
          onChange={onFileChange}
        ></input>
        <label for="file-input2" id="file-label">Select Multiple .proto Files</label>
        <input
          id="file-input2"
          className="multipleProtoFiles--input"
          type="file"
          accept=".proto"
          onChange={onFileChangeCallback}
        />
      </div>
      {dataReady && <Tree treeData={current} />}
    </div>
  );
}

export default Treemap;
