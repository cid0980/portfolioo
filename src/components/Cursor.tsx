import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.45 })
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.45 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine)
    if (!fine) return

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      setHovering(!!t?.closest('a, button, [data-cursor]'))
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      {/* immediate dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] size-1.5 rounded-full bg-lime"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      {/* trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[94] rounded-full border border-lime/40"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          opacity: hovering ? 0.9 : 0.55,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </>
  )
}
