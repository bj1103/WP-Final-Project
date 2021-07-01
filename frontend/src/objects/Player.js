import { useRef, useEffect, useState } from "react";
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useBox } from "@react-three/cannon";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';
import characters from '../data/characters.json';

import Text from './Text';

const Player = ({ name, move, myPos, setMyPos, character }) => {
    const { camera } = useThree();
    const orbitref = useRef();
    const gltf = useLoader(GLTFLoader, characters[character]['type']);
    // const [ref, api] = useBox(() => ({ mass: 20, position: [0, 0, 0] }));
    // const position = useRef([0, 0, 0]);

    // useEffect(() => {
    //     const unsubscribe = api.position.subscribe((p) => {position.current = p});
    //     return () => unsubscribe();
    // }, []);

    const keydownListender = (e) => {
        if (e.key === 'ArrowUp') {
            move('UP');
            gltf.scene.rotation.set(0, Math.PI, 0);
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z - 1);
            // api.position.set(position.current[0], position.current[1], position.current[2] - 1);
            // dz = 5;
        } else if (e.key === 'ArrowDown') {
            move('DOWN');
            gltf.scene.rotation.set(0, 0, 0);
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 1);
            // api.position.set(position.current[0], position.current[1], position.current[2] + 1);
            // dz = -5;
        } else if (e.key === 'ArrowLeft') {
            move('LEFT');
            gltf.scene.rotation.set(0, -Math.PI / 2, 0);
            gltf.scene.position.set(gltf.scene.position.x - 1, gltf.scene.position.y, gltf.scene.position.z);
            // api.position.set(position.current[0] - 1, position.current[1], position.current[2]);
            // dx = 5;
        } else if (e.key === 'ArrowRight') {
            move('RIGHT');
            gltf.scene.rotation.set(0, Math.PI / 2, 0);
            gltf.scene.position.set(gltf.scene.position.x + 1, gltf.scene.position.y, gltf.scene.position.z);
            // api.position.set(position.current[0] + 1, position.current[1], position.current[2]);
            // dx = -5;
        }
        // setMyPos(position.current);
        // console.log(myPos)
        // console.log(gltf.scene.position)
        setMyPos([gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z])

        // camera.position.set(position.current[0], position.current[1] + 3, position.current[2] + 5);
        camera.position.set(gltf.scene.position.x, gltf.scene.position.y + 3, gltf.scene.position.z + 5);
        orbitref.current.target.x = gltf.scene.position.x;
        orbitref.current.target.y = gltf.scene.position.y;
        orbitref.current.target.z = gltf.scene.position.z;
        // orbitref.current.target.x = position.current[0];
        // orbitref.current.target.y = position.current[1];
        // orbitref.current.target.z = position.current[2];
        orbitref.current.update();
    }
    
    useEffect(() => {
        document.addEventListener('keydown', keydownListender);
    }, []);

    let mixer;
    if (gltf.animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach(clip => {
            const action = mixer.clipAction(clip);
            action.play();
        });
    }

    useFrame((state, delta) => {
        mixer?.update(delta);
    });

    return (
        <>
            <Text text={name} position={[gltf.scene.position.x, 2, gltf.scene.position.z]}/>
            {/* <Text text={name} position={[position.current[0], 2, position.current[2]]}/> */}
            {<primitive 
                object={gltf.scene} 
                scale={characters[character]['scalar']}
                rotation={[0, Math.PI / 2, 0]}
                position={[0, 0, 0]}
            />}
            {/* <mesh ref={ref}  position={[0, 5, 0]} >
                <boxBufferGeometry attach="geometry" />
                <meshLambertMaterial attach="material" color="blue" />
            </mesh> */}
            <OrbitControls ref={orbitref} target={[0, 0, 0]}/>
        </>
    );
}

export default Player;