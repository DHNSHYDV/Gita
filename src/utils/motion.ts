import { type Variants, type Transition } from 'framer-motion';

/**
 * Standardized Motion Design Tokens for the Gita Application
 * Calm, cinematic, spiritual, minimal, intentional.
 */

export const DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.55,
  cinematic: 0.85,
  ambient: 3.2,
} as const;

export const EASING = {
  // Apple / Material 3 standard curve
  standard: [0.2, 0.0, 0, 1.0] as const,
  // Signature Gita emphasized curve for natural, serene elevation
  emphasized: [0.16, 1, 0.3, 1] as const,
  // Gentle deceleration
  decelerate: [0.0, 0.0, 0.2, 1] as const,
  // Soft acceleration
  accelerate: [0.4, 0.0, 1, 1] as const,
} as const;

export const SPRINGS: Record<string, Transition> = {
  gentle: {
    type: 'spring',
    stiffness: 240,
    damping: 28,
    mass: 0.9,
  },
  snappy: {
    type: 'spring',
    stiffness: 380,
    damping: 32,
  },
  tactile: {
    type: 'spring',
    stiffness: 420,
    damping: 22,
  },
};

/**
 * Micro-stagger container variant for content hierarchy reveal (35-45ms)
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.042,
      delayChildren: 0.02,
      ease: EASING.emphasized,
    },
  },
};

/**
 * Clean vertical card / element entrance
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.emphasized,
    },
  },
};

/**
 * Hero Daily Verse Card entrance:
 * Gently rises from 10px below, settles into stillness
 */
export const heroCardEntrance: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATIONS.slow,
      ease: EASING.emphasized,
    },
  },
};

/**
 * Clean fade entrance
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.standard,
    },
  },
};

/**
 * Scale fade entrance for logos and icons
 */
export const scaleFadeIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATIONS.normal,
      ease: EASING.emphasized,
    },
  },
};
