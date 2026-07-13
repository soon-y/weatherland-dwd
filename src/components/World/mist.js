import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import vertexShader from './shader/mist/vertexShader.glsl'
import fragmentShader from './shader/mist/fragmentShader.glsl'

const MAX_COUNT = 1000
const center = [0, 0, 0]
const area = 17
const height = 17

export default function Mist({ visibility, isDay, weather }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const visibilityValue = visibility ?? weather.current.visibility

  const positions = useMemo(() => {
    const arr = new Float32Array(MAX_COUNT * 3)

    for (let i = 0; i < MAX_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2

      const phi = Math.acos(2 * Math.random() - 1)

      const radius = Math.cbrt(Math.random()) * area

      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = radius * Math.cos(phi)
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }

    return arr
  }, [area])

  const scales = useMemo(() => {
    const arr = new Float32Array(MAX_COUNT)

    for (let i = 0; i < MAX_COUNT; i++) {
      arr[i] = 15 + Math.random() * 25
    }

    return arr
  }, [])

  const particles = useMemo(
    () =>
      Array.from(
        { length: MAX_COUNT },
        () => ({
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.04,
          vz: (Math.random() - 0.5) * 0.25
        })
      ),
    []
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrength: { value: 0 },
      uIsDay: { value: isDay ? 1 : 0 },
      uArea: { value: area }
    }),
    []
  )

  useFrame((_, delta) => {
    delta = Math.min(delta, 0.05)
    if (
      !pointsRef.current ||
      !materialRef.current
    )
      return

    materialRef.current.uniforms.uTime.value += delta
    materialRef.current.uniforms.uIsDay.value = isDay ? 1 : 0
    materialRef.current.uniforms.uStrength.value = Math.pow(THREE.MathUtils.clamp(1 - visibilityValue / 5000, 0, 1), 2)

    for (let i = 0; i < MAX_COUNT; i++) {
      const idx = i * 3

      positions[idx] += particles[i].vx * delta
      positions[idx + 1] += particles[i].vy * delta
      positions[idx + 2] += particles[i].vz * delta

      if (
        positions[idx + 1] > height * 0.5 ||
        positions[idx + 1] < -height * 0.5
      ) {
        particles[i].vy *= -1
      }

      const x = positions[idx]
      const z = positions[idx + 2]

      const distance = Math.sqrt(x * x + z * z)

      if (distance > area) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * area

        positions[idx] = Math.cos(angle) * radius
        positions[idx + 1] = (Math.random() - 0.5) * height
        positions[idx + 2] = Math.sin(angle) * radius
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points
      ref={pointsRef}
      position={center}
      frustumCulled={false}
      renderOrder={1000}
    >
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={MAX_COUNT}
          itemSize={3}
        />

        <bufferAttribute
          attach="attributes-aScale"
          array={scales}
          count={MAX_COUNT}
          itemSize={1}
        />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </points>
  )
}