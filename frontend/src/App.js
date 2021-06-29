import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";

import SignIn from './containers/SignIn';
import Room from './containers/Room';
import { message } from "antd";

const LOCALSTORAGE_KEY_NAME = "save-name";
const LOCALSTORAGE_KEY_TOKEN = "save-token";

const App = () => {
  const savedName = localStorage.getItem(LOCALSTORAGE_KEY_NAME);
  const savedToken = localStorage.getItem(LOCALSTORAGE_KEY_TOKEN);

  const [signedIn, setSignedIn] = useState(false);
  const [name, setName] = useState(savedName || "");
  const [token, setToken] = useState(savedToken || "");

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
        duration: 0.5
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
            <Room name={name} token={token} displayStatus={displayStatus}/>
          )
        : 
        <div className="App">
          <SignIn 
          name={name}
          setName={setName}
          token={token}
          setToken={setToken}
          setSignedIn={setSignedIn}
          displayStatus={displayStatus}
          />
        </div>
      }
    </>
  );
};

export default App;
