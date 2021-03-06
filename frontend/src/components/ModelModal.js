import { Modal, Select } from 'antd';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
    USER_LOGIN_MUTATION,
    CHARACTER_QUERY,
    ROOM_CREATE_MUTATION,
} from '../graphql';

import characters from '../data/characters.json';
import { useEffect, useState } from 'react';

const { Option } = Select;

const ModelModal = ({ token, name, model, setModel, visible, setVisible, setSignedIn, displayStatus, setScene }) => {
    const [userLogin] = useMutation(USER_LOGIN_MUTATION);
    const [createRoom] = useMutation(ROOM_CREATE_MUTATION);
    const [usableCharacters, setUsableCharacters] = useState([]);

    const login = (token, name) => {
        userLogin({
            variables: {
                token: token,
                name: name,
                character: model,
            }
        }).then(() => {
            displayStatus({ type: 'success', msg: 'Joined successfully' });
            setSignedIn(true);
        }).catch(e => {
            console.log('Login faild');
            createRoom({
                variables: {
                    token: token,
                    name: name,
                    character: model,
                }
            }).then(() => {
                displayStatus({ type: 'success', msg: `Room ${token} created` });
                setSignedIn(true);
            });
        });
    }

    const handleOk = () => {
        setVisible(false);
        login(token, name, model);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleChange = (value) => {
        // console.log(`selected ${value}`);
        setModel(value);
    };

    const handleChange2 = (value) => {
        // console.log(`selected ${value}`);
        setScene(value);
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

    const scenes = [
        'sunset',
        'dawn',
        'night',
        'warehouse',
        'forest',
        'apartment',
        'studio',
        'city',
        'park',
        'lobby',
    ];

    return (
        <Modal
            title="Room options"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={false}
        >
            <p>Character</p>
            <Select
                defaultValue={Object.keys(characters)[0]}
                style={{ width: '100%', marginBottom: '20px' }}
                onChange={handleChange}
            >
                {
                    usableCharacters.map(key =>
                        <Option value={key} key={key}>{key}</Option>
                    )
                }
            </Select>
            <p>Background</p>
            <Select
                defaultValue={scenes[0]}
                style={{ width: '100%' }}
                onChange={handleChange2}
            >
                {
                    scenes.map(key =>
                        <Option value={key} key={key}>{key}</Option>    
                    )
                }
            </Select>
        </Modal>
    );
};

export default ModelModal;
