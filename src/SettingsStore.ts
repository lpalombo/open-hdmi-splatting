import { Mutate, StoreApi, create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  amplitude: number;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      amplitude: 0.5,
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

withStorageDOMEvents(useSettingsStore);
