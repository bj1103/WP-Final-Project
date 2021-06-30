import { useState, useRef, useEffect, Suspense  } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Physics } from '@react-three/cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import helvetiker_regular from 'three/examples/fonts/helvetiker_regular.typeface.json';
import models from '../models.json';

import Plane from '../objects/Plane';
import Player from '../objects/Player';
import Friend from '../objects/Friend';

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
    // const gltf = useLoader(GLTFLoader, models[model]);
    // const friendsGltf = useLoader(GLTFLoader, models["test"]);

    useEffect(() => {
        console.log('Room is created');
    }, []);

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
                console.log(`subscription data ${data.name}: ${data.pos.x}, ${data.pos.z}`);
                console.log('friends:', friends);
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

    const font = new THREE.FontLoader().parse(helvetiker_regular);
    const textOptions = {
        font,
        size: 5,
        height: 1
    };

    return (
        <Canvas camera={{position: [myPos[0], 3, myPos[2]+5]}}>
            {/* <Stars /> */}
            <ambientLight intensity={0.5} />
            {/* <spotLight position={[10, 15, 10]} angle={0.3} /> */}
            <Physics>
                <Suspense fallback={null}>
                    {
                        friends.map(friend => {
                            return (friend.name === name) ? 
                            <Player 
                                move={move}
                                myPos={myPos}
                                // gltf={gltfs['test'].clone(true)}
                            /> :
                            <Friend 
                                name={friend.name} 
                                key={friend.name} 
                                x={friend.pos.x} 
                                z={friend.pos.z}
                                textOptions={textOptions}
                                // gltf={gltfs['test'].clone(true)}
                            />
                        })
                    }
                </Suspense>
                <Plane />
            </Physics>
        </Canvas>
    );
};

export default Room;
