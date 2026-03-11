import type { Variants } from 'framer-motion';

/** Shared framer-motion animation variants for all /app/* pages */

export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

export const staggerVariants: Variants = {
  animate: { transition: { staggerChildren: 0.1 } },
};
