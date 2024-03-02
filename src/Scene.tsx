import { Splat } from './Splat';
import { useRef } from 'react';
import { Matrix4, Vector4 } from 'three';
import { useAudioStore } from './AudioProcessor';
import { Box } from '@react-three/drei';
import { Vector3, useFrame } from '@react-three/fiber';
import { useSettingsStore } from './SettingsStore';

export const SPLAT_SCENES = {
  church: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_church.splat',
    position: [0, -14, -5],
    rotation: [-0.1, -2.6, 0.3],
    scale: 8,
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
    position: [0, -1, -3],
    rotation: [0, -1.5, 0],
    scale: 1,
  },
  playroom: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/playroom.splat',
    position: [0, -1.25, 0],
    rotation: [0, 2, 0],
    scale: 1,
  },
  yorkdalenike: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_yorkdale_nike.splat',
    position: [0, -2, 0],
    rotation: [0, 0, 0],
    scale: 1,
  },
  yorkdalepassage: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_yorkdale_passage.splat',
    position: [0, -1, -1],
    rotation: [0, 0, 0],
    scale: 1,
  },
  sherlocksroom: {
    src: 'https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_Sherlock_s_Room.splat',
    position: [0, -1, 0],
    rotation: [0, 0, 0],
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
  // const audioTexture = useAudioStore(state => state.audioTexture);
  const [currentScene, yPos, rotSpeed, rotDistance, rotVector] = useSettingsStore(state => [
    state.scene,
    state.yPos,
    state.rotSpeed,
    state.rotDistance,
    state.rotVector,
  ]);

  useFrame(({ clock }) => {
    group.current.position.y = yPos;
    group.current.position.x =
      Math.sin(clock.getElapsedTime() * rotSpeed) * (rotDistance * rotVector.x);
    group.current.position.z =
      Math.cos(clock.getElapsedTime() * rotSpeed) * (rotDistance * rotVector.y);
    group.current.lookAt(0, yPos, 0);
  });

  return (
    <>
      <color attach="background" args={['#000']} />
      <ambientLight />
      {/* <Environment preset="sunset" background /> */}
      <group matrixAutoUpdate={false} onUpdate={self => (self.matrix = matrix)}>
        {/* <group ref={group}>
        </group> */}
        <group ref={group}>
          {/* <Box args={[1, 1, 1]} position={[0, 0, 1]} scale={0.5}>
            <meshBasicMaterial color="red" map={audioTexture} />
          </Box> */}
          <Splat {...SPLAT_SCENES[currentScene]} viewport={viewport} />
        </group>
      </group>
    </>
  );
}
