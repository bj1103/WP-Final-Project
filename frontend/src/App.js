import logo from './logo.svg';
import './App.css';
import { useState, useEffect, Suspense } from "react";

import SignIn from './components/SignIn';
import Room from './components/Room';
import { message } from "antd";

import models from './data/models.json';
import characters from './data/characters.json';

const LOCALSTORAGE_KEY_NAME = "save-name";
const LOCALSTORAGE_KEY_TOKEN = "save-token";
const LOCALSTORAGE_KEY_MODEL = "save-model";

const App = () => {
  const savedName = localStorage.getItem(LOCALSTORAGE_KEY_NAME);
  const savedToken = localStorage.getItem(LOCALSTORAGE_KEY_TOKEN);
  const savedModel = localStorage.getItem(LOCALSTORAGE_KEY_MODEL);

  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState(savedName || "");
  const [token, setToken] = useState(savedToken || "");
  const [model, setModel] = useState(savedModel || Object.keys(characters)[0]);

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY_NAME, name);
      localStorage.setItem(LOCALSTORAGE_KEY_TOKEN, token);
    }
  }, [signedIn, name, token]);

  const displayStatus = (payload) => {
    if (payload.msg) {
      const {type, msg} = payload;
      const content = {
        content: msg,
        duration: 2.5,
      }
      switch (type){
        case 'success':
          message.success(content);
          break;
        case 'error':
        default:
          message.error(content);
          break;
      }
    }
  }

  return (
    <>
      {
        signedIn 
        ? (
            <Suspense fallback={null}>
              <Room 
                name={name} 
                token={token}
                model={model}
                displayStatus={displayStatus}
              />
            </Suspense>
          )
        : 
        <div className="App">
          <SignIn 
            name={name}
            setName={setName}
            token={token}
            setToken={setToken}
            model={model}
            setModel={setModel}
            setSignedIn={setSignedIn}
            displayStatus={displayStatus}
          />
        </div>
      }
    </>
  );
};

export default App;
