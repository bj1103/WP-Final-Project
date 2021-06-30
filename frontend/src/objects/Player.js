import { useRef, useEffect } from "react";
import { useThree, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';
import models from '../models';

const Player = ({ move, myPos }) => {
    const { camera } = useThree();
    const orbitref = useRef();
    const gltf = useLoader(GLTFLoader, models['Spotted-Jelly']);
    // console.log(gltf);
    const keydownListender = (e) => {
        if (e.key === 'ArrowUp') {
            move('UP');
            gltf.scene.rotation.set(0, Math.PI / 2, 0);
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z - 1);
            // dz = 5;
        } else if (e.key === 'ArrowDown') {
            move('DOWN');
            gltf.scene.rotation.set(0, -Math.PI / 2, 0);
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 1);
            // dz = -5;
        } else if (e.key === 'ArrowLeft') {
            move('LEFT');
            gltf.scene.rotation.set(0, Math.PI, 0);
            gltf.scene.position.set(gltf.scene.position.x - 1, gltf.scene.position.y, gltf.scene.position.z);
            // dx = 5;
        } else if (e.key === 'ArrowRight') {
            move('RIGHT');
            gltf.scene.rotation.set(0, 0, 0);
            gltf.scene.position.set(gltf.scene.position.x + 1, gltf.scene.position.y, gltf.scene.position.z);
            // dx = -5;
        }
        camera.position.set(gltf.scene.position.x, gltf.scene.position.y + 3, gltf.scene.position.z + 5);
        orbitref.current.target.x = gltf.scene.position.x;
        orbitref.current.target.y = gltf.scene.position.y;
        orbitref.current.target.z = gltf.scene.position.z;
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
            {<primitive 
                object={gltf.scene} 
                scale={0.4}
                rotation={[0, Math.PI / 2, 0]}
                position={myPos}
            />}
            <OrbitControls ref={orbitref} target={myPos}/>
        </>
    );
}

export default Player;
