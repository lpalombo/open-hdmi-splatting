import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { DataTexture, MathUtils, RedFormat, RepeatWrapping } from 'three';
import * as TONE from 'tone';
import { create } from 'zustand';

const FFT_SIZE = 512;

type AudioStore = {
  audioTexture: DataTexture;
};
export const useAudioStore = create<AudioStore>(set => ({
  audioTexture: new DataTexture(
    new Uint8Array(FFT_SIZE * 2),
    FFT_SIZE,
    2,
    RedFormat,
    undefined,
    undefined,
    RepeatWrapping,
    RepeatWrapping
  ),
}));

export function AudioProcessor() {
  const [mic, setMic] = useState<TONE.UserMedia>();
  const [FFT, setFFT] = useState<TONE.FFT>();
  const [RMS, setRMS] = useState<TONE.Meter>();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>();
  const [device, setDevice] = useState<string>();

  const audioTexture = useAudioStore(state => state.audioTexture);

  let lowRMTValue: number;
  let normRMTValue: number;

  useEffect(() => {
    TONE.UserMedia.enumerateDevices().then(devices => {
      setDevices(devices);
      setDevice(devices[0].deviceId);
    });
    return () => {
      if (mic) {
        mic.close();
        mic.dispose();
      }
      if (FFT) {
        FFT.dispose();
      }
      if (RMS) {
        RMS.dispose();
      }
    };
  }, []);

  const handleMicOpen = async (e: Event) => {
    e.preventDefault();
    if (!device) return;
    await TONE.start();
    const filter = new TONE.Filter({
      type: 'lowpass',
      frequency: 180,
    });
    const meter = new TONE.Meter();
    setRMS(meter);
    const mic = new TONE.UserMedia();

    mic.open(device).then(() => {
      const FFT = new TONE.FFT(FFT_SIZE);
      mic.connect(filter);
      mic.connect(FFT);
      filter.connect(meter);
      // filter.toDestination();
      setFFT(FFT);
    });
    setMic(mic);
  };

  const gradData = new Uint8Array(FFT_SIZE).map((_, i) => (i / FFT_SIZE) * 255);
  // console.log(gradData);
  // const notHitData = new Uint8Array(FFT_SIZE).fill(0);
  const hit = useRef(0);
  const hitCount = useRef(0);
  const hitCountLerped = useRef(0);
  const cooldown = useRef(0);
  const lastRMTValue = useRef(0);

  useFrame((_, delta) => {
    if (!mic || !FFT || !RMS) return;
    const data = FFT.getValue();
    lowRMTValue = RMS.getValue() as number;
    normRMTValue = MathUtils.mapLinear(lowRMTValue, -120, 0, 0, 1);
    if (lowRMTValue > -20 && lastRMTValue.current < -20 && cooldown.current <= 0) {
      // TODO make threshold adjustable
      hit.current = 1;
      hitCount.current += 0.5;
      cooldown.current = 1;
    }
    lastRMTValue.current = lowRMTValue;
    if (hit.current > 0) {
      hit.current -= 1 * delta;
    }
    if (cooldown.current > 0) {
      cooldown.current -= 3 * delta;
    }
    hitCountLerped.current = MathUtils.lerp(hitCountLerped.current, hitCount.current, 0.1);
    audioTexture.offset.x = hitCountLerped.current;
    audioTexture.updateMatrix();
    // console.log(hitCountLerped.current);
    // audioTexture.image.data.set(new Uint8Array(FFT_SIZE).fill(hit.current * 255));
    // audioTexture.image.data.set(hitData);
    // console.log(data);
    audioTexture.image.data.set([
      ...new Uint8Array(FFT_SIZE).map((_, i) => (i / FFT_SIZE) * (normRMTValue * 255)),
      ...data,
    ]);

    audioTexture.needsUpdate = true;
  });

  return (
    <>
      <Html>
        <form className="show-on-hover" onSubmit={handleMicOpen}>
          {/* choose input */}
          <select
            onChange={e => {
              const device = e.target.value;
              setDevice(device);
              if (mic) {
                mic.close();
                setFFT(undefined);
                setRMS(undefined);
              }
            }}>
            {devices &&
              devices
                .filter(device => device.kind === 'audioinput')
                .map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
          </select>
          <button>Start</button>
        </form>
      </Html>
    </>
  );
}
