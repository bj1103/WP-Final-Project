import "../App.css";
import { useState } from 'react';
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

import ModelModal from './ModelModal';

const SignIn = ({ name, setName, token, setToken, model, setModel, setSignedIn, displayStatus, setScene }) => {

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <div className="App-title"><h1>Join a room</h1></div>
            <ModelModal
                token={token}
                name={name}
                model={model}
                setModel={setModel}
                visible={modalVisible}
                setVisible={setModalVisible}
                setSignedIn={setSignedIn}
                displayStatus={displayStatus}
                setScene={setScene}
            />
            <Input
                value={token}
                placeholder="Enter room token"
                onChange={(e) => setToken(e.target.value)}
                size="large"
                style={{ width: 300, marginTop: 20, marginBottom: 10 }}
            ></Input>
            <Input.Search
                prefix={<UserOutlined />}
                value={name}
                placeholder="Enter your name"
                enterButton="Join"
                onChange={(e) => setName(e.target.value)}
                size="large"
                style={{ width: 300, marginTop: 10 }}
                onSearch={(name) => {
                    if (!token)
                        displayStatus({type: 'error', msg: 'Missing room token'});
                    else if (!name)
                        displayStatus({type: 'error', msg: 'Missing user name'});
                    else {
                        setModalVisible(true);
                    }
                }}
            ></Input.Search>
        </>
    );
}

export default SignIn;