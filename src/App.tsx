import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Environment, OrbitControls, PerspectiveCamera, View } from '@react-three/drei';
import { Splat, SplatMaterialType } from './Splat';
import { ReactNode, forwardRef, useRef } from 'react';
import { Matrix4, Vector4 } from 'three';
import { Scene } from './Scene';
import { AudioProcessor } from './AudioProcessor';
import { Controls } from './Controls';

const matrix = new Matrix4();
const HALF_PI = Math.PI / 2;

const smallDistToCenter = 5.968;
const smallScreenWidth = 5.438;
const smallCamHFOV = (360 / Math.PI) * Math.atan(smallScreenWidth / 2 / smallDistToCenter);
const smallCamAspect = 1.6999;
const smallCamMainFov =
  (Math.atan(Math.tan((smallCamHFOV * Math.PI) / 360) / smallCamAspect) * 360) / Math.PI;
const smallViewport = new Vector4(0, 0, 1202, 742);

const largeDistToCenter = 2.719;
const largeScreenWidth = 11.936;
const largeCamHFOV = (360 / Math.PI) * Math.atan(largeScreenWidth / 2 / largeDistToCenter);
const largeCamAspect = 3.555;
const largeCamMainFov =
  (Math.atan(Math.tan((largeCamHFOV * Math.PI) / 360) / largeCamAspect) * 360) / Math.PI;
const largeViewport = new Vector4(0, 0, 2636, 742);

// query param includes debug
const search = new URLSearchParams(window.location.search);
const debug = search.has('debug');
const controls = search.has('controls');

function App() {
  const container = useRef<HTMLDivElement>(null!);

  if (controls) {
    return <Controls />;
  }

  return (
    <>
      <div id="canvas-container" ref={container}>
        <div className="top-section">
          <PanelView className="panel panel-west">
            <Scene matrix={matrix} viewport={smallViewport} />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 2, 0]}
              fov={smallCamMainFov}
              near={1.5}
            />
          </PanelView>
          <PanelView className="panel panel-north">
            <Scene matrix={matrix} viewport={largeViewport} />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 1, 0]}
              fov={largeCamMainFov}
              near={1.5}
            />
          </PanelView>
          <PanelView className="panel panel-east">
            <Scene matrix={matrix} viewport={smallViewport} />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 0, 0]}
              fov={smallCamMainFov}
              near={1.5}
            />
          </PanelView>
          <PanelView className="panel panel-south">
            <Scene matrix={matrix} viewport={largeViewport} />
            <PerspectiveCamera
              makeDefault
              position={[0, 0, 0]}
              rotation={[0, HALF_PI * 3, 0]}
              fov={largeCamMainFov}
              near={1.5}
            />
          </PanelView>
        </div>
        {debug && (
          <PanelView className="bottom-section">
            <Scene matrix={matrix} />
            <PerspectiveCamera makeDefault position={[0, 0, 0.001]} />
            <OrbitControls enableZoom={false} target={[0, 0, 0]} />
          </PanelView>
        )}
        <Canvas
          dpr={[0.5, 1]}
          // camera={{ position: [-3, 1, -5.5], fov: 45, near: 1, far: 100 }}
          eventSource={container}
          eventPrefix="client"
          className="canvas">
          <View.Port />
          <AudioProcessor />
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

export default App;
