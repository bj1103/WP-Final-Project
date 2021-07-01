import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Stars, useAspect, Environment } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { notification } from 'antd';

import Plane from '../objects/Plane';
import Player from '../objects/Player';
import Friend from '../objects/Friend';
import Objects from '../objects/Objects';
import SelectModal from './SelectModal';
import MessageModal from './MessageModal';

import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';

import {
    USER_MOVE_MUTATION,
    ROOM_QUERY,
    USER_SUBSCRIPTION,
    OBJECT_SUBSCRIPTION,
} from '../graphql';

const Room = ({ name, token, model, scene, displayStatus }) => {
    const [userMove] = useMutation(USER_MOVE_MUTATION);
    const [friends, setFriends] = useState([]);
    const [myPos, setMyPos] = useState([0, 0, 0]);
    const [objects, setObjects] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, _setModalVisible2] = useState(false);

    const modalVisible2Ref = useRef(modalVisible2);

    const setModalVisible2 = (b) => {
        modalVisible2Ref.current = b;
        _setModalVisible2(b);
    };

    const move = (direction) => {
        userMove({
            variables: {
                token: token,
                name: name,
                direction: direction,
            }
        }).catch(e => {
            console.log('Move mutation fucked up');
            console.log(JSON.stringify(e, null, 2));
        });
    }

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && !modalVisible2Ref.current) {
                setModalVisible(true);
            }
            if (e.key === 'm') {
                setModalVisible2(true);
            }
        })
    }, []);

    const { data } = useQuery(
        ROOM_QUERY,
        {
            variables: {
                token: token,
            }
        }
    );

    useEffect(() => {
        if (data) {
            console.log('query data', data);
            setFriends(data.room.users);
            setObjects(data.room.objects);
            let me = data.room.users.find(user => user.name === name);
            setMyPos([me.pos.x, 0, me.pos.z]);
        }
    }, [data]);

    useSubscription(
        OBJECT_SUBSCRIPTION,
        {
            variables: {
                token: token,
            },
            onSubscriptionData: (data) => {
                data = data.subscriptionData.data.subscribeToObject;
                console.log('Subscription getting object:', data);
                try {
                    var newObjects = objects.slice(0);
                    var idx = newObjects.findIndex(object => object.id === data.id);
                    if (idx === -1) {
                        newObjects.push(data);
                    } else {
                        newObjects[idx] = data;
                    }
                    setObjects(newObjects);
                } catch (e) {
                    console.log('Subscription fucked up', e)
                }
            },
        }
    )

    const openNotification = (name, msg) => {
        notification.open({
            message: name,
            description: msg,
            duration: 30,
        });
    };

    useSubscription(
        USER_SUBSCRIPTION,
        {
            variables: {
                token: token,
            },
            onSubscriptionData: (data) => {
                data = data.subscriptionData.data.subscribeToUser;
                // console.log('subscription data', data);
                // console.log('friends:', friends);
                if (friends.length === 0)
                    return;
                try {
                    var newFriends = friends.slice(0);
                    var idx = newFriends.findIndex(friend => friend.name === data.name);
                    if (idx === -1) {
                        openNotification(`${data.name} joined`, '');
                        newFriends.push(data);
                    } else {
                        if (data.message !== newFriends[idx].message) {
                            console.log('Message', data.message);
                            openNotification(data.name, data.message);
                        }
                        newFriends[idx] = data;
                    }
                    setFriends(newFriends);
                } catch (e) {
                    console.log('Subscription fucked up', e)
                }
            }
        }
    );

    return (
        <>
            <SelectModal
                token={token}
                x={myPos[0]}
                z={myPos[2]}
                visible={modalVisible}
                setVisible={setModalVisible}
            />
            <MessageModal
                token={token}
                name={name}
                visible={modalVisible2}
                setVisible={setModalVisible2}
            />
            <Canvas camera={{ position: [0, 3, 5] }}>
                {/* <Stars /> */}
                <ambientLight intensity={0.5} />
                {/* <spotLight position={[10, 15, 10]} angle={0.3} /> */}
                <Environment background={true} preset={scene} />
                <Physics>
                    <Suspense fallback={null}>
                        {
                            friends.map(friend => {
                                return (friend.name === name) ?
                                    <Player
                                        name={name}
                                        move={move}
                                        key={name}
                                        myPos={myPos}
                                        setMyPos={setMyPos}
                                        character={model}
                                    /> :
                                    <Friend
                                        name={friend.name}
                                        key={friend.name}
                                        x={friend.pos.x}
                                        z={friend.pos.z}
                                        character={friend.character}
                                    />
                            })
                        }
                        {
                            objects.map(object => <Objects type={object.type} x={object.pos.x} z={object.pos.z} />)
                        }
                    </Suspense>
                    <Plane />
                </Physics>
            </Canvas>
        </>
    );
};

export default Room;
