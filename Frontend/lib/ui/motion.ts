import type { Variants, Transition } from 'framer-motion'

const standardTransition: Transition = {
    duration: 0.25,
    ease: [0.2, 0.8, 0.4, 1],
}

const emphasisTransition: Transition = {
    duration: 0.35,
    ease: [0.17, 0.92, 0.38, 0.98],
}

export const messageVariants = (reduceMotion = false): Variants => ({
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    visible: reduceMotion
        ? { opacity: 1 }
        : { opacity: 1, y: 0, transition: standardTransition },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, transition: standardTransition },
})

export const cardVariants = (reduceMotion = false): Variants => ({
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    visible: reduceMotion
        ? { opacity: 1 }
        : { opacity: 1, scale: 1, transition: emphasisTransition },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, transition: emphasisTransition },
})

export const drawerVariants = (reduceMotion = false): Variants => ({
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, x: '100%' },
    visible: reduceMotion
        ? { opacity: 1 }
        : { opacity: 1, x: 0, transition: { ...emphasisTransition, duration: 0.4 } },
    exit: reduceMotion ? { opacity: 0 } : { opacity: 0, x: '100%', transition: { ...emphasisTransition, duration: 0.3 } },
})

export const pillHover = (reduceMotion = false): Variants => ({
    rest: { scale: 1, opacity: 0.85 },
    hover: reduceMotion
        ? { opacity: 1 }
        : { scale: 1.03, opacity: 1, transition: standardTransition },
})
