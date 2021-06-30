import { Modal, Select } from 'antd';
import models from '../data/models';

import { useMutation } from '@apollo/react-hooks';
import { OBJECT_CREATE_MUTATION } from '../graphql';
import { useEffect, useState } from 'react';

const { Option } = Select;

const SelectModal = ({ token, x, z, visible, setVisible }) => {
    const [createObject] = useMutation(OBJECT_CREATE_MUTATION);
    const [model, setModel] = useState(Object.keys(models)[0]);

    const handleOk = () => {
        try {
            console.log('Create object', token, model, x, z);
            createObject({
                variables: {
                    token: token,
                    type: model,
                    posX: Math.round(x),
                    posZ: Math.round(z),
                }
            });
        } catch (e) {
            console.log("Create object up")
            console.log(JSON.stringify(e, null, 2));
        }
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setModel(value);
    };

    return (
        <Modal 
            title="Choose the object to place" 
            visible={visible} 
            onOk={handleOk}
            okText="Select"
            onCancel={handleCancel}
            closable={false}
        >
            <Select 
                defaultValue={Object.keys(models)[0]} 
                style={{ width: '100%' }} 
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

export default SelectModal;
