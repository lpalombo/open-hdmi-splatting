import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { DataTexture, RedFormat } from 'three';
import * as TONE from 'tone';
import { create } from 'zustand';

const FFT_SIZE = 1024;

type AudioStore = {
  audioTexture: DataTexture;
};
export const useAudioStore = create<AudioStore>(set => ({
  audioTexture: new DataTexture(new Uint8Array(FFT_SIZE), FFT_SIZE / 2, 1, RedFormat),
}));

export function AudioProcessor() {
  const [mic, setMic] = useState<TONE.UserMedia>();
  const [FFT, setFFT] = useState<TONE.FFT>();
  const [RMS, setRMS] = useState<TONE.Meter>();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>();
  const [device, setDevice] = useState<string>();

  const audioTexture = useAudioStore(state => state.audioTexture);

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
    };
  }, []);

  const handleMicOpen = async () => {
    if (!device) return;
    await TONE.start();
    const filter = new TONE.Filter({
      type: 'lowpass',
      frequency: 180,
    });
    // const meter = new TONE.Meter();
    // setRMS(meter);
    const mic = new TONE.UserMedia();

    mic.open(device).then(() => {
      const FFT = new TONE.FFT(FFT_SIZE);
      mic.connect(filter);
      filter.connect(FFT);
      // filter.connect(meter);
      // filter.toDestination();
      setFFT(FFT);
    });
    setMic(mic);
  };

  useFrame(() => {
    if (!mic || !FFT) return;
    const data = FFT.getValue();
    audioTexture.image.data.set(data);
    // console.log(RMS.getValue());
    audioTexture.needsUpdate = true;
  });

  return (
    <>
      <Html>
        <form>
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
        </form>
        <button onClick={handleMicOpen}>Start</button>
      </Html>
    </>
  );
}
