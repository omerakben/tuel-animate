import { useEffect, useLayoutEffect } from 'react';
import { isServer } from '@tuel/utils';

export const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;
