import { Modal, Input } from 'antd';

import { useMutation } from '@apollo/react-hooks';
import { SEND_MESSAGE_MUTATION } from '../graphql';
import { useEffect, useState } from 'react';

const SelectModal = ({ token, name, visible, setVisible }) => {
    const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
    const [message, setMessage] = useState("");

    const handleOk = () => {
        console.log('Send message', token, name, message);
        sendMessage({
            variables: {
                token: token,
                name: name,
                message: message,
            }
        });
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <Modal 
            title="Type the message" 
            visible={visible} 
            onOk={handleOk}
            okText="Send"
            onCancel={handleCancel}
            closable={false}
        >
            <Input value={message} onChange={handleChange}></Input>
        </Modal>
    );
};

export default SelectModal;
