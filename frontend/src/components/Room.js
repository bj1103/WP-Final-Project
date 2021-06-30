import { useState, useRef, useEffect, Suspense  } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Physics } from '@react-three/cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import models from '../models.json';

import Plane from '../objects/Plane';
import Player from '../objects/Player';
import Friend from '../objects/Friend';
import Objects from '../objects/Objects';

import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import { 
    USER_MOVE_MUTATION, 
    ROOM_QUERY,
    USER_SUBSCRIPTION,
} from '../graphql';

const Room = ({ name, token, model, displayStatus }) => {
    const [userMove] = useMutation(USER_MOVE_MUTATION);
    const [friends, setFriends] = useState([]);
    const [myPos, setMyPos] = useState([0, 0, 0]);
    const [objects, setObjects] = useState([]);

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
    
    const { loading, error, data, subscribeToMore } = useQuery(
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
        USER_SUBSCRIPTION,
        {
            variables: {
                token: token,
            },
            onSubscriptionData: (data) => {
                data = data.subscriptionData.data.subscribeToUser;
                // console.log(`subscription data ${data.name}: ${data.pos.x}, ${data.pos.z}`);
                // console.log('friends:', friends);
                if (data.name === name || friends.length === 0)
                    return;
                try {
                    var newFriends = friends.slice(0);
                    var idx = newFriends.findIndex(friend => friend.name === data.name);
                    if (idx === -1) {
                        newFriends.push(data);
                    } else {
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
        <Canvas camera={{position: [0, 3, 5]}}>
            {/* <Stars /> */}
            <ambientLight intensity={0.5} />
            {/* <spotLight position={[10, 15, 10]} angle={0.3} /> */}
            <Physics>
                <Suspense fallback={null}>
                    {
                        friends.map(friend => {
                            return (friend.name === name) ? 
                            <Player
                                name={name}
                                move={move}
                                myPos={myPos}
                            /> :
                            <Friend 
                                name={friend.name} 
                                key={friend.name} 
                                x={friend.pos.x} 
                                z={friend.pos.z}
                            />
                        })
                    }
                </Suspense>
                <Suspense fallback={null}>
                    {
                        objects.map(object => <Objects type={object.type} x={object.pos.x} z={object.pos.z}/>)
                    }
                </Suspense>
                <Plane />
            </Physics>
        </Canvas>
    );
};

export default Room;
