import { useRef, useEffect } from "react";
import { useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Player = ({ move }) => {
    const { camera } = useThree();
    const gltf = useLoader(GLTFLoader, './test/scene.gltf');
    const orbitref = useRef();
    // console.log(gltf);
    const keydownListender = (e) => {
        if (e.key === 'ArrowUp') {
            move('UP');
            gltf.scene.rotation.set(0, -Math.PI, 0);
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z - 1);
            // dz = 5;
        } else if (e.key === 'ArrowDown') {
            move('DOWN');
            gltf.scene.rotation.set(0, 0, 0);
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 1);
            // dz = -5;
        } else if (e.key === 'ArrowLeft') {
            move('LEFT');
            gltf.scene.rotation.set(0, -Math.PI / 2, 0);
            gltf.scene.position.set(gltf.scene.position.x - 1, gltf.scene.position.y, gltf.scene.position.z);
            // dx = 5;
        } else if (e.key === 'ArrowRight') {
            move('RIGHT');
            gltf.scene.rotation.set(0, Math.PI / 2, 0);
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
    return (
        <>
            <primitive object={gltf.scene} scale={1.2} rotation={[ 0, -Math.PI, 0]}/>
            <OrbitControls ref={orbitref} target={[0, 0, 0]}/>
        </>
    );
}

export default Player;
