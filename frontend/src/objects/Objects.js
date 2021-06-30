import { useGLTF, useTexture } from '@react-three/drei';
import models from '../data/models.json';

const Objects = ({ type, x, z }) => {
    let gltf = useGLTF(models[type]['type']);
    let position = [x, 0 ,z];
    // console.log('fuck objects', models[type]['type']);
    return <primitive object={gltf.scene.clone(true)} dispose={null} position={position} scale={models[type]['scalar']}/>
};

export default Objects;