'use client';

import type { ReactNode } from 'react';
import { LazyMotion } from 'motion/react';

const loadFeatures = () => import('@/utils/shared/domAnimation').then((res) => res.default);

export default function LazyProvider({ children }: { children: ReactNode }) {
    return <LazyMotion strict features={loadFeatures} >{children}</LazyMotion>;
}