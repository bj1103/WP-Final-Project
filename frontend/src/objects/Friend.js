import { useRef, useEffect } from "react";
import { useThree, useLoader } from '@react-three/fiber';
import { useBox } from "@react-three/cannon";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Friend = ({ name, x, z, textOptions }) => {
    // const gltf = useLoader(GLTFLoader, './test/scene.gltf');
    const [ref, api] = useBox(() => ({ mass: 1, position: [0, 0, 0] }));
    const position = useRef([0, 0, 0]);

    useEffect(() => {
        const unsubscribe = api.position.subscribe((p) => {position.current = p});
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log('friend', name, x, z);
        api.position.set(x, position.current[1], z);
    }, [x, z]);

    return (
        <mesh
            ref={ref}
            position={[0, 0, 0]}
        >
            <boxBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color="hotpink" />
        </mesh>
        // <>
        //     <primitive object={gltf.scene} scale={1.2} rotation={[ 0, -Math.PI, 0]} />
        // </>
    );
}

export default Friend;
