import { useState, useRef, useEffect, Suspense  } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Physics } from '@react-three/cannon';

import helvetiker_regular from 'three/examples/fonts/helvetiker_regular.typeface.json';

import Plane from '../objects/Plane';
import Player from '../objects/Player';
import Friend from '../objects/Friend';

import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import { 
    USER_MOVE_MUTATION, 
    ROOM_QUERY,
    USER_SUBSCRIPTION,
} from '../graphql';

const Room = ({ name, token, displayStatus }) => {

    const [userMove] = useMutation(USER_MOVE_MUTATION);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        console.log('Room is created once');
    }, []);

    const move = (direction) => {
        userMove({
            variables: {
                token: token,
                name: name,
                direction: direction,
            }
        }).catch(e => {
            console.log('Fuck you');
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
            setFriends(data.room.users.filter(user => user.name !== name));
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
                console.log('subscription data', data);
                console.log('friends:', friends);
                if (data.name === name)
                    return;
                try {
                    var newFriends = friends.slice(0);
                    var idx = newFriends.findIndex(friend => friend.name === data.name);
                    if (idx === -1) {
                        return;
                    }
                    newFriends[idx] = data;
                    setFriends(newFriends);
                } catch (e) {
                    console.log('fuck you', e)
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
        <Canvas camera={{position: [0, 3, 5]}}>
            <Stars />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} />
            <Physics>
                <Suspense fallback={null}>
                    <Player move={move}/>
                    {
                        friends.map(friend => (
                            <Friend 
                                name={friend.name} 
                                key={friend.name} 
                                x={friend.pos.x} 
                                z={friend.pos.z}
                                textOptions={textOptions}
                            />
                        ))
                    }
                </Suspense>
                <Plane />
            </Physics>
        </Canvas>
    );
};

export default Room;
