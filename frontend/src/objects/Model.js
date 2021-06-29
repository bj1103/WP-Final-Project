import { useRef, useEffect, Suspense } from "react";
import { useThree, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const Model = ({ modelPos }) => {
    const { camera } = useThree();
    const gltf = useLoader(GLTFLoader, 'test.gltf');
    const orbitref = useRef();
    console.log(gltf);

    const keydownListender = (e) => {
        let dx = 0, dz = 0;
        if (e.key === 'ArrowUp') {
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z - 1);
            dz = 5;
        } else if (e.key === 'ArrowDown') {
            gltf.scene.position.set(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 1);
            dz = -5;
        } else if (e.key === 'ArrowLeft') {
            gltf.scene.position.set(gltf.scene.position.x - 1, gltf.scene.position.y, gltf.scene.position.z);
            dx = 5;
        } else if (e.key === 'ArrowRight') {
            gltf.scene.position.set(gltf.scene.position.x + 1, gltf.scene.position.y, gltf.scene.position.z);
            dx = -5
        }
        camera.position.set(gltf.scene.position.x, gltf.scene.position.y + 3, gltf.scene.position.z + 5);
        orbitref.current.target.x = gltf.scene.position.x;
        orbitref.current.target.y = gltf.scene.position.y;
        orbitref.current.target.z = gltf.scene.position.z;
        orbitref.current.update();
        console.log(orbitref.current);
    }
    
    
    useEffect(() => {
        document.addEventListener('keydown', keydownListender);
    }, []);
    return (
        <>
            <primitive object={gltf.scene} scale={0.5}/>
            <OrbitControls ref={orbitref} target={[0, 0, 0]}/>
        </>
    );
}

export default Model;