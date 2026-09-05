import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { logVisit } from './lib/analytics'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Statement from './components/Statement'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'

/* admin bundle is only downloaded when the route is actually opened */
const Admin = lazy(() => import('./components/Admin'))

/**
 * Matches both `/admin` (needs SPA rewrite on the host) and `#admin`
 * (works on any static host, including GitHub Pages).
 */
function isAdminRoute() {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname.replace(/\/+$/, '')
  /* accepts "#admin" and "#/admin" */
  const hash = window.location.hash.replace(/^#\/?/, '')
  return path.endsWith('/admin') || hash === 'admin'
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [admin] = useState(isAdminRoute)

  /* record the visit — fire-and-forget, never on the admin route */
  useEffect(() => {
    if (!admin) void logVisit()
  }, [admin])

  useEffect(() => {
    if (admin) return
    const lenis = new Lenis({ lerp: 0.095 })
    lenisRef.current = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [admin])

  const scrollTo = (id: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(id, { offset: -72, duration: 1.25 })
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (admin) {
    return (
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-ink font-mono text-sm text-fog">
            Loading…
          </div>
        }
      >
        <Admin />
      </Suspense>
    )
  }

  return (
    <div className="relative min-h-screen bg-ink font-body text-cream antialiased">
      <AnimatePresence>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <Cursor />
      <div className="noise" aria-hidden />
      <Nav onNavigate={scrollTo} />
      <main>
        <Hero onNavigate={scrollTo} start={loaded} />
        <Marquee />
        <About />
        <Projects />
        <Skills />
        <Statement />
        <Contact />
      </main>
      <Footer onNavigate={scrollTo} />
    </div>
  )
}
