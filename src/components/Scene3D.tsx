import {
  Component,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

const ACCENT = '#4b46e5'
const DEEP = '#17171d'
const SKY = '#9db8ff'

/* detected once — touch devices get a lighter render */
const COARSE =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches

/* shared pointer state — tracked on the window so the scene responds
   anywhere on the page without ever blocking scroll or touch */
const pointerRef = { x: 0, y: 0 }

/* Shown if WebGL is unavailable — never leave the space empty */
function StaticOrb() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="size-52 animate-pulse rounded-full bg-[radial-gradient(circle_at_34%_28%,#8f89f5,#4b46e5_55%,#17171d_85%)] opacity-80 blur-2xl sm:size-64" />
      <div className="absolute size-40 rounded-full border border-lime/30 sm:size-52" />
    </div>
  )
}

/* If WebGL ever fails to initialize on a device, show the static orb
   instead of crashing the page. */
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <StaticOrb /> : this.props.children
  }
}

/* Slow ambient particle field */
function Particles({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4.2 + Math.random() * 5.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={ACCENT}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* The hero blob — distorting dark core + geodesic wireframe shell */
function Core({ detail = 32 }: { detail?: number }) {
  const core = useRef<THREE.Mesh>(null)
  const wire = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const orbitA = useRef<THREE.Group>(null)
  const orbitB = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    /* breathing core */
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(t * 1.3) * 0.035)
    }
    if (wire.current) {
      wire.current.rotation.y += delta * 0.14
      wire.current.rotation.x += delta * 0.06
    }
    if (ringA.current) {
      ringA.current.rotation.z = t * 0.25
      ringA.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.4) * 0.2
    }
    if (ringB.current) {
      ringB.current.rotation.z = -t * 0.18
      ringB.current.rotation.y = Math.sin(t * 0.3) * 0.45
    }
    if (orbitA.current) orbitA.current.rotation.y = t * 0.4
    if (orbitB.current) orbitB.current.rotation.y = -t * 0.26 + 2.1
  })

  return (
    <group>
      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.2}>
        {/* distorting core */}
        <mesh ref={core}>
          <icosahedronGeometry args={[1.55, detail]} />
          <MeshDistortMaterial
            color="#1b1b22"
            metalness={0.7}
            roughness={0.24}
            distort={0.42}
            speed={1.7}
          />
        </mesh>
        {/* geodesic shell */}
        <mesh ref={wire} scale={1.28}>
          <icosahedronGeometry args={[1.55, 2]} />
          <meshBasicMaterial
            color={ACCENT}
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>
      </Float>

      {/* orbit rings */}
      <mesh ref={ringA}>
        <torusGeometry args={[2.6, 0.008, 8, 128]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 3, 0, 0.6]}>
        <torusGeometry args={[3.15, 0.006, 8, 128]} />
        <meshBasicMaterial color={DEEP} transparent opacity={0.16} />
      </mesh>

      {/* orbiting satellites */}
      <group ref={orbitA}>
        <Float speed={2.2} rotationIntensity={0.4} floatIntensity={1.4}>
          <mesh position={[2.8, 0.9, 0]}>
            <icosahedronGeometry args={[0.14, 1]} />
            <meshStandardMaterial
              color={ACCENT}
              emissive={ACCENT}
              emissiveIntensity={1.2}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
        </Float>
      </group>
      <group ref={orbitB}>
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.3}>
          <mesh position={[2.4, -0.8, 0.5]}>
            <icosahedronGeometry args={[0.09, 1]} />
            <meshStandardMaterial
              color={SKY}
              emissive={SKY}
              emissiveIntensity={0.9}
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
        </Float>
      </group>
    </group>
  )
}

/* Motion rig — always alive; leans toward the pointer wherever it is */
function Rig({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime

    const targetY = Math.sin(t * 0.3) * 0.3 + pointerRef.x * 0.55
    const targetX = Math.cos(t * 0.22) * 0.14 - pointerRef.y * 0.32

    ref.current.rotation.y =
      THREE.MathUtils.damp(ref.current.rotation.y, targetY, 2.6, delta) +
      delta * 0.18
    ref.current.rotation.x = THREE.MathUtils.damp(
      ref.current.rotation.x,
      targetX,
      2.6,
      delta,
    )
  })

  return <group ref={ref}>{children}</group>
}

export default function Scene3D() {
  /* listen on the window — works for mouse AND touch drags,
     never intercepts gestures */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerRef.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.3, delay: 0.55, ease: 'easeOut' }}
      className="absolute inset-0"
    >
      <SceneBoundary>
        <Canvas
          camera={{ position: [0, 0, 7.4], fov: 42 }}
          dpr={COARSE ? [1, 1.5] : [1, 1.8]}
          gl={{ antialias: !COARSE, alpha: true }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 6, 4]} intensity={1.6} />
          <pointLight
            position={[-6, -3, -2]}
            intensity={20}
            distance={22}
            color={ACCENT}
          />
          <pointLight
            position={[6, -4, 5]}
            intensity={9}
            distance={20}
            color="#8fc4ff"
          />
          <Rig>
            <Core detail={COARSE ? 18 : 32} />
            <Particles count={COARSE ? 320 : 600} />
          </Rig>
        </Canvas>
      </SceneBoundary>
    </motion.div>
  )
}
