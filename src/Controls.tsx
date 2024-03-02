import { useEffect, useRef } from 'react';
import { SettingsStore, useSettingsStore } from './SettingsStore';
import { Pane } from 'tweakpane';

export function Controls() {
  const ref = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    if (!ref.current) return;
    const pane = new Pane({ container: ref.current });
    const settings = useSettingsStore.getState();
    Object.keys(settings).forEach(key => {
      pane.addBinding(settings, key as keyof SettingsStore).on('change', () => {
        useSettingsStore.setState(settings);
      });
    });
    return () => {
      if (pane) pane.dispose();
    };
  }, []);

  return <div ref={ref}></div>;
}
