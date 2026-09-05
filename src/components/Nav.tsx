import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { EASE } from './motion'
import { GitHubIcon } from './icons'
import GlitchName from './GlitchName'

const LINKS = [
  { id: '#about', label: 'About' },
  { id: '#work', label: 'Work' },
  { id: '#skills', label: 'Skills' },
  { id: '#contact', label: 'Contact' },
]

export default function Nav({
  onNavigate,
}: {
  onNavigate: (id: string) => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  })

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > lastY && y > 180)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* scrollspy — highlight the section currently in view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    LINKS.forEach((l) => {
      const el = document.querySelector(l.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (id: string) => {
    setOpen(false)
    onNavigate(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !open ? -90 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-cream/[0.08] bg-ink/95 shadow-[0_10px_36px_-20px_rgba(23,23,29,0.25)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between lg:h-[72px]">
          <button
            onClick={() => go('#top')}
            className="group flex items-center gap-2"
            aria-label="Back to top"
          >
            <span className="font-display text-lg font-semibold tracking-tight text-cream transition-colors group-hover:text-lime">
              <GlitchName />
              <span className="text-lime transition-colors group-hover:text-cream">/</span>
              dev
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                data-active={active === l.id}
                className={`nav-link px-4 py-2 text-sm transition-colors ${
                  active === l.id ? 'text-lime' : 'text-fog hover:text-cream'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="https://github.com/cid0980"
              target="_blank"
              rel="noreferrer"
              className="icon-btn"
              aria-label="GitHub profile"
            >
              <GitHubIcon size={17} />
            </a>
            <button
              onClick={() => go('#contact')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-5 py-2.5 font-display text-sm font-semibold text-white shadow-[0_12px_26px_-10px_rgba(75,70,229,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
            >
              Let&apos;s talk
              <ArrowUpRight size={15} />
            </button>
          </div>

          <button
            className="icon-btn lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-lime"
          aria-hidden
        />
      </motion.header>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/95 px-6 pb-10 pt-24 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.5, delay: 0.06 * i, ease: EASE }}
                  onClick={() => go(l.id)}
                  className="group flex items-center justify-between border-b border-cream/10 py-5 text-left"
                >
                  <span className="font-display text-3xl font-semibold text-cream transition-colors group-hover:text-lime">
                    {l.label}
                  </span>
                  <span className="font-mono text-xs text-fog">
                    0{i + 1}
                  </span>
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
              className="mt-auto flex items-center justify-between"
            >
              <div>
                <p className="mono-label">Get in touch</p>
                <a
                  href="mailto:asencid07@gmail.com"
                  className="mt-2 block font-display text-lg text-cream"
                >
                  asencid07@gmail.com
                </a>
              </div>
              <a
                href="https://github.com/cid0980"
                target="_blank"
                rel="noreferrer"
                className="icon-btn"
                aria-label="GitHub profile"
              >
                <GitHubIcon size={18} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
