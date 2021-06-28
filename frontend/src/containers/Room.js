import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import * as TWEEN from "@tweenjs/tween.js";

const Box = ({ boxPos }) => {
    const { camera } = useThree();
    const [ref, api] = useBox(() => ({ mass: 1, position: boxPos }));
    const position = useRef(boxPos);
    const orbitref = useRef();
    
    useEffect(() => {
        const unsubscribe = api.position.subscribe((p) => {position.current = p});
        return () => unsubscribe();
    }, []);

    const keydownListender = (e) => {
        // console.log(camera);
        if (e.key === 'ArrowUp') {
            api.position.set(position.current[0], position.current[1], position.current[2] - 1);
        } else if (e.key === 'ArrowDown') {
            api.position.set(position.current[0], position.current[1], position.current[2] + 1);
        } else if (e.key === 'ArrowLeft') {
            api.position.set(position.current[0] - 1, position.current[1], position.current[2]);
        } else if (e.key === 'ArrowRight') {
            api.position.set(position.current[0] + 1, position.current[1], position.current[2]);
        }
        camera.position.set(position.current[0] + 5, position.current[1] + 5, position.current[2] + 5);
        orbitref.current.target.x = position.current[0];
        orbitref.current.target.y = position.current[1];
        orbitref.current.target.z = position.current[2];
        orbitref.current.update();
        console.log(orbitref.current);
    }
    
    useEffect(() => {
        document.addEventListener('keydown', keydownListender);
    }, []);

    return (
        <>
            <OrbitControls ref={orbitref}/>
            <mesh
                ref={ref}
                position={boxPos}
            >
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="hotpink" />
            </mesh>
        </>
    )
}

const Plane = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI/2, 0, 0],
    }));
    return (
        <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]}>
            <planeBufferGeometry attach="geometry" args={[1000, 1000, 128, 128]}/>
            <meshLambertMaterial
                attach="material" 
                color="white"
                roughness={1}
                wireframe
            />
        </mesh>
    )
}

const Room = ({ me, displayStatus }) => {
    return (
        <Canvas>
            <Stars />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} />
            <Physics>
                <Box boxPos={[0, 5, 0]} />
                <Plane />
            </Physics>       
        </Canvas>
    );
};

export default Room;
