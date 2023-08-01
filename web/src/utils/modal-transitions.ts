import { motion } from 'framer-motion'

export const modalTransitionProps = {
  transition: {
    duration: 0.5
  },
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1
  },
  component: motion.div
}