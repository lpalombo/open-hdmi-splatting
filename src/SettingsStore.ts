import { Mutate, StoreApi, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SplatKey } from './Scene';
import { Vector2 } from 'three';

export type StoreWithPersist<T> = Mutate<StoreApi<T>, [['zustand/persist', unknown]]>;

const withStorageDOMEvents = <T>(store: StoreWithPersist<T>) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate();
    }
  };

  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};

export type SettingsStore = {
  scene: SplatKey;
  yPos: number;
  rotSpeed: number;
  rotDistance: number;
  rotVector: Vector2;
  amplitude: number;
  bassamplitude: number;
  wavelength: number;
  minvolume: number;
  minbass: number;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      scene: 'playroom',
      yPos: 0,
      rotSpeed: 0,
      rotDistance: 0.5,
      rotVector: new Vector2(1, 1),
      amplitude: 0.5,
      bassamplitude: 0.5,
      wavelength: 1,
      minvolume: 0.1,
      minbass: 0.1,
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

withStorageDOMEvents(useSettingsStore);
