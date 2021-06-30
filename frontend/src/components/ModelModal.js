import { Modal, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { USER_LOGIN_MUTATION, CHARACTER_QUERY } from '../graphql';

import characters from '../data/characters.json';
import { useEffect, useState } from 'react';

const { Option } = Select;

const ModelModal = ({ token, name, model, setModel, visible, setVisible, setSignedIn }) => {
    const [userLogin] = useMutation(USER_LOGIN_MUTATION);
    const [usableCharacters, setUsableCharacters] = useState([]);

    const login = (token, name) => {
        try {
            userLogin({
                variables: {
                    token: token,
                    name: name,
                    character: model
                }
            });
            setSignedIn(true);
        } catch (e) {
            console.log("Login fucked up")
            console.log(JSON.stringify(e, null, 2));
        }
    }

    const handleOk = () => {
        setVisible(false);
        login(token, name, model);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setModel(value);
    };

    const { data, refetch } = useQuery(
        CHARACTER_QUERY, 
        {
            variables: {
                token: token,
                characters: Object.keys(characters),
            }
        }
    );

    useEffect(() => {
        if (data) {
            console.log('Character data:', data);
            setUsableCharacters(data.getCharacter);
        }
    }, [data]);

    useEffect(() => {
        if (visible) {
            console.log('Opened');
            refetch();
        }
    }, [visible]);

    return (
        <Modal 
            title="Choose your character" 
            visible={visible} 
            onOk={handleOk} 
            onCancel={handleCancel}
            closable={false}
        >
            <Select
                defaultValue={Object.keys(characters)[0]} 
                style={{ width: '100%' }} 
                onChange={handleChange}
            >
                {/* {
                    Object.keys(usableCharacters).map(key =>
                        <Option value={key} key={key}>{key}</Option>
                    )
                } */}
                {
                    usableCharacters.map(key =>
                        <Option value={key} key={key}>{key}</Option>
                    )
                }
            </Select>
        </Modal>
    );
};

export default ModelModal;
