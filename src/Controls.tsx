import { useEffect, useRef } from 'react';
import { SettingsStore, useSettingsStore } from './SettingsStore';
import { Pane } from 'tweakpane';
import { SPLAT_SCENES, SplatKey } from './Scene';

export function Controls() {
  const ref = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    if (!ref.current) return;
    const pane = new Pane({ container: ref.current });
    const settings = useSettingsStore.getState();
    Object.keys(settings).forEach(key => {
      if (key === 'scene') {
        const opts = {} as Record<string, string>;
        Object.keys(SPLAT_SCENES).forEach(key => {
          opts[key] = key;
        });
        pane
          .addBinding(settings, 'scene', {
            options: opts,
          })
          .on('change', value => {
            useSettingsStore.setState({ scene: value.value });
          });
        return;
      } else {
        pane.addBinding(settings, key as keyof SettingsStore).on('change', () => {
          useSettingsStore.setState(settings);
        });
      }
    });
    return () => {
      if (pane) pane.dispose();
    };
  }, []);

  return <div ref={ref}></div>;
}
