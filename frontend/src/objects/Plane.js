import { usePlane } from '@react-three/cannon';

const Plane = () => {
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI/2, 0, 0],
    }));
    return (
        <mesh ref={ref} rotation={[-Math.PI/2, 0, 0]}>
            <planeBufferGeometry attach="geometry" args={[50, 50, 25, 25]}/>
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