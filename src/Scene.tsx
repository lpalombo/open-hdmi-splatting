import { Splat } from './Splat';
import { useRef } from 'react';
import { Matrix4, Vector4 } from 'three';
import { useAudioStore } from './AudioProcessor';
import { Box } from '@react-three/drei';
import { Vector3, useFrame } from '@react-three/fiber';

const SPLAT_SCENES = {
  church: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_church.splat',
    position: [0, -3, -5],
    rotation: [-0.1, -2.6, 0.1],
    scale: 4,
  },
  ichiban_living: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_Ichiban_Living.splat',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  },
  ibowlca: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/ibowlca.splat',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  },
  kitchen: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/kitchen.splat',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
  },
  lego_car: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/lego_car.splat',
    position: [-0.5, -1.25, 5],
    rotation: [0, -1.5, 0],
    scale: 1,
  },
  playroom: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/playroom.splat',
    position: [0, -1.25, 8],
    rotation: [0, 2, 0],
    scale: 1,
  },
} satisfies Record<
  string,
  { src: string; position: Vector3; rotation: Vector3; scale: Vector3 | number }
>;

export type SplatKey = keyof typeof SPLAT_SCENES;

export function Scene(props: { matrix: Matrix4; viewport?: Vector4 }) {
  const { matrix, viewport } = props;
  const group = useRef<THREE.Group>(null!);
  const audioTexture = useAudioStore(state => state.audioTexture);

  useFrame(({ clock }) => {
    // group.current.position.x = Math.sin(clock.getElapsedTime() * 1) * 0.5;
    // group.current.position.z = Math.cos(clock.getElapsedTime() * 1) * 0.5;
    group.current.lookAt(0, 0, 0);
  });

  const currentScene = 'playroom';

  return (
    <>
      <color attach="background" args={['#000']} />
      <ambientLight />
      {/* <Environment preset="sunset" background /> */}
      <group matrixAutoUpdate={false} onUpdate={self => (self.matrix = matrix)}>
        {/* <group ref={group}>
        </group> */}
        <group ref={group} position={[-1, 0, -8]}>
          <Box args={[1, 1, 1]} position={[0, 0, 1]} scale={0.5}>
            <meshBasicMaterial color="red" map={audioTexture} />
          </Box>
          <Splat
            {...SPLAT_SCENES[currentScene]}
            viewport={viewport}
            alphaHash
            // alphaTest={0.1}
          />
        </group>
      </group>
    </>
  );
}
