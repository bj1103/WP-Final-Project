import { useRef, useEffect } from "react";
import { useThree, useLoader } from '@react-three/fiber';
import { useBox } from "@react-three/cannon";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import characters from '../data/characters.json';
import Text from './Text';

const Friend = ({ name, x, z, character, message }) => {
    // console.log('type:', character);
    // console.log('char:', characters);
    // console.log(character, characters[character]['type']);
    const gltf = useLoader(GLTFLoader, characters[character]['type']);
    // const [ref, api] = useBox(() => ({ mass: 1, position: [0, 0, 0] }));
    // const position = useRef([0, 0, 0]);

    // useEffect(() => {
    //     const unsubscribe = api.position.subscribe((p) => {position.current = p});
    //     return () => unsubscribe();
    // }, []);

    useEffect(() => {
        console.log('friend', name, x, z);
        // api.position.set(x, position.current[1], z);
        gltf.scene.position.set(x, 0, z);
    }, [x, z]);

    return (
        // <>
        //     <Text text={name} position={[position.current[0], 2, position.current[2]]}/>
        //     <mesh ref={ref}  position={[0, 0, 0]} >
        //         <boxBufferGeometry attach="geometry" />
        //         <meshLambertMaterial attach="material" color="hotpink" />
        //     </mesh>
        // </>
        <>
            <Text text={name} position={[gltf.scene.position.x, 2, gltf.scene.position.z]}/>
            <Text text={message} position={[gltf.scene.position.x, 2.5, gltf.scene.position.z]}/>
            {<primitive 
                object={gltf.scene.clone(true)} 
                scale={characters[character]['scalar']}
                rotation={[0, Math.PI / 2, 0]}
            />}
        </>
    );
}

export default Friend;
