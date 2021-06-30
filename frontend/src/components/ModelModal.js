import { Modal, Select } from 'antd';
import models from '../models';
import { useMutation } from '@apollo/react-hooks';
import { USER_LOGIN_MUTATION } from '../graphql';

const { Option } = Select;

const ModelModal = ({ token, name, model, setModel, visible, setVisible, setSignedIn }) => {
    const [userLogin] = useMutation(USER_LOGIN_MUTATION);

    const login = (token, name) => {
        try {
            userLogin({
                variables: {
                    token: token,
                    name: name,
                    character: model
                }
            });
        } catch (e) {
            console.log("Login fucked up")
            console.log(JSON.stringify(e, null, 2));
        }
    }
    const handleOk = () => {
        setVisible(false);
        setSignedIn(true);
        login(token, name, model);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    function handleChange(value) {
        console.log(`selected ${value}`);
        setModel(value);
    }

    return (
        <Modal 
            title="Choose your character" 
            visible={visible} 
            onOk={handleOk} 
            onCancel={handleCancel}
        >
            <Select 
                defaultValue={Object.keys(models)[0]} 
                style={{ width: 120 }} 
                onChange={handleChange}
            >
                {
                    Object.keys(models).map(key =>
                        <Option value={key} key={key}>{key}</Option>
                    )
                }
            </Select>
        </Modal>
    );
};

export default ModelModal;