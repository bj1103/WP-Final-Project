import { useState, useRef, useEffect, Suspense  } from "react";
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Plane from '../objects/Plane';
import Model from '../objects/Model';

const Room = ({ me, displayStatus }) => {
    return (
        <Canvas camera={{position: [0, 3, 5]}}>
            <Stars />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} />
            <Physics>
                <Suspense fallback={null}>
                    <Model modelPos={[0, 2, 0]}/>
                </Suspense>
                <Plane />
            </Physics>
        </Canvas>
    );
};

export default Room;
