'use client'
import { motion, type Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.6,  ease: [0.25, 0.1, 0.25, 1] } },
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.6,  ease: [0.25, 0.1, 0.25, 1] } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show:   { opacity: 1, scale: 1,    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
}

const vp = { once: true, margin: '-80px' }

type Props = {
  children: React.ReactNode
  variants?: Variants
  delay?: number
  className?: string
}

export function FadeUp({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeLeft({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      variants={fadeLeft}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeRight({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      variants={fadeRight}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={vp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

export { motion }
