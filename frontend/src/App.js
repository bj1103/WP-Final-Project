import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";

import SignIn from './containers/SignIn';
import Room from './containers/Room';
import { message } from "antd";

const LOCALSTORAGE_KEY_ME = "save-me";
const LOCALSTORAGE_KEY_TOKEN = "save-token";

const App = () => {
  const savedMe = localStorage.getItem(LOCALSTORAGE_KEY_ME);
  const savedToken = localStorage.getItem(LOCALSTORAGE_KEY_TOKEN);

  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState(savedMe || "");
  const [token, setToken] = useState(savedToken || "");

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY_ME, me);
      localStorage.setItem(LOCALSTORAGE_KEY_TOKEN, token);
    }
  }, [signedIn, me, token]);

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
    <div className="App">
      {signedIn ? (<Room me={me} displayStatus={displayStatus}/>) : (
      <SignIn 
        me={me}
        setMe={setMe}
        token={token}
        setToken={setToken}
        setSignedIn={setSignedIn}
        displayStatus={displayStatus}
      />)}
    </div>);
};

export default App;
