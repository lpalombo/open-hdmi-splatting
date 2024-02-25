import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Environment, OrbitControls, PerspectiveCamera, View } from '@react-three/drei';
import { Splat, SplatMaterialType } from './Splat';
import { ReactNode, forwardRef, useRef } from 'react';
import { Matrix4 } from 'three';

const matrix = new Matrix4();
const HALF_PI = Math.PI / 2;

function App() {
  const container = useRef<HTMLDivElement>(null!);
  return (
    <>
      <div id="canvas-container" ref={container}>
        <div className="top-section">
          <PanelView className="panel panel-west">
            <Scene />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 2, 0]}
              fov={48.98}
            />
          </PanelView>
          <PanelView className="panel panel-north">
            <Scene />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 1, 0]}
              fov={131.0123}
            />
          </PanelView>
          <PanelView className="panel panel-east">
            <Scene />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 0, 0]}
              fov={48.98}
            />
          </PanelView>
          <PanelView className="panel panel-south">
            <Scene />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 3, 0]}
              fov={131.0123}
            />
          </PanelView>
        </div>

        <PanelView className="bottom-section">
          <Scene />
          <PerspectiveCamera makeDefault position={[0, 0, 0.001]} />
          <OrbitControls enableZoom={false} target={[0, 0, 0]} />
        </PanelView>
        <Canvas
          dpr={[0.5, 1]}
          // camera={{ position: [-3, 1, -5.5], fov: 45, near: 1, far: 100 }}
          eventSource={container}
          eventPrefix="client"
          className="canvas">
          <View.Port />
        </Canvas>
      </div>
    </>
  );
}

const PanelView = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  (props, fref) => {
    const { children, className } = props;
    return (
      <div ref={fref} className={className}>
        {/** @ts-ignore */}
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {children}
        </View>
      </div>
    );
  }
);

function Scene() {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    group.current.position.x = Math.sin(clock.getElapsedTime() * 2) * 5;
    group.current.position.z = Math.cos(clock.getElapsedTime() * 2) * 5;
  });

  return (
    <>
      <color attach="background" args={['#171720']} />
      <ambientLight />
      <Environment preset="sunset" background />
      <group matrixAutoUpdate={false} onUpdate={self => (self.matrix = matrix)}>
        <group ref={group}>
          <Box args={[1, 1, 1]} position={[0, 0, 0]} />
        </group>
        {/* <group ref={group}>
          <Splat
            src="https://pub-c94e113880784f8f8227940d6abceeef.r2.dev/gs_Ichiban_Living.splat"
            position={[0, 0, 0]}
          />
        </group> */}
      </group>
    </>
  );
}

export default App;
