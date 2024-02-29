import { Splat } from './Splat';
import { useRef } from 'react';
import { Matrix4 } from 'three';
import { useAudioStore } from './AudioProcessor';
import { Box } from '@react-three/drei';

export function Scene(props: { matrix: Matrix4 }) {
  const { matrix } = props;
  const group = useRef<THREE.Group>(null!);
  const audioTexture = useAudioStore(state => state.audioTexture);

  // useFrame(({ clock }) => {
  //   group.current.position.x = Math.sin(clock.getElapsedTime() * 2) * 5;
  //   group.current.position.z = Math.cos(clock.getElapsedTime() * 2) * 5;
  // });

  return (
    <>
      <color attach="background" args={['#171720']} />
      <ambientLight />
      {/* <Environment preset="sunset" background /> */}
      <group matrixAutoUpdate={false} onUpdate={self => (self.matrix = matrix)}>
        {/* <group ref={group}>
        </group> */}
        <group ref={group}>
          <Box args={[1, 1, 1]} position={[0, 0, 1]} scale={0.5}>
            <meshBasicMaterial color="red" map={audioTexture} />
          </Box>
          <Splat
            src="https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_church.splat"
            position={[-2, -0.5, 0]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </group>
      </group>
    </>
  );
}
