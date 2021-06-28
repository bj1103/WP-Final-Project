import "../App.css";
import { Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const SignIn = ({ me, setMe, token, setToken, setSignedIn, displayStatus }) => (
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
            value={me}
            placeholder="Enter your name"
            enterButton="Join"
            onChange={(e) => setMe(e.target.value)}
            size="large"
            style={{ width: 300, marginTop: 10 }}
            onSearch={(name) => {
                if (!token)
                    displayStatus({type: 'error', msg: 'Missing room token'});
                else if (!name)
                    displayStatus({type: 'error', msg: 'Missing user name'});
                else
                    setSignedIn(true);
            }}
        ></Input.Search>
    </>
);

export default SignIn;