import { gsap } from 'gsap';
import { isClient } from '@tuel/utils';

export function registerGsapPlugins(plugins: any[]) {
  if (isClient && plugins.length > 0) {
    gsap.registerPlugin(...plugins);
  }
}
