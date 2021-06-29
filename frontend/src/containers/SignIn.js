import "../App.css";
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { useMutation } from '@apollo/react-hooks';
import { USER_LOGIN_MUTATION } from '../graphql';

const SignIn = ({ name, setName, token, setToken, setSignedIn, displayStatus }) => {

    const [userLogin] = useMutation(USER_LOGIN_MUTATION);

    const login = (token, name) => {
        userLogin({
            variables: {
                token: token,
                name: name,
            }
        });
    }

    return (
        <>
            <div className="App-title"><h1>Join a room</h1></div>
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
                        login(token, name);
                        setSignedIn(true);
                    }
                }}
            ></Input.Search>
        </>
    );
}

export default SignIn;