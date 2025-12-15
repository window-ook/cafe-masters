'use client'

import { LazyMotion } from 'motion/react';

const loadFeatures = () => import('@/utils/shared/domAnimation').then((res) => res.default)

export default function LazyProvider({ children }: { children: React.ReactNode }) {
    return <LazyMotion strict features={loadFeatures} >{children}</LazyMotion>
}