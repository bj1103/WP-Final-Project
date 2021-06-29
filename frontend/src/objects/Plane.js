import { usePlane } from '@react-three/cannon';

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

export default Plane;