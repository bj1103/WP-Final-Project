import { useFBX, useTexture } from '@react-three/drei';

const Object = ({ modelPath, position }) => {
    let fbx = useFBX(modelPath);
    return <primitive object={fbx.clone(true)} dispose={null} position={position} scale={0.2}/>
};

export default Object;
