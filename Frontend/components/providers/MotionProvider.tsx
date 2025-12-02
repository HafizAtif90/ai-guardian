'use client'

import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { useUiStore } from '@/lib/store/ui'

interface MotionProviderProps {
    children: ReactNode
}

const MotionProvider = ({ children }: MotionProviderProps) => {
    const prefersReducedMotion = useUiStore((state) => state.prefersReducedMotion)

    return (
        <LazyMotion features={domAnimation} strict>
            <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
                {children}
            </MotionConfig>
        </LazyMotion>
    )
}

export default MotionProvider
