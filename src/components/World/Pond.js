import * as THREE from 'three'
import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { param } from "@/lib/param"
import vertexShader from './shader/pond/vertexShader.glsl'
import fragmentShader from './shader/pond/fragmentShader.glsl'

export default function Pond({ progress, windDir, windSpd, rain, temp, weather }) {
  const materialRef = useRef()
  const ripplesRef = useRef([])
  const waveOffset = useRef(0)
  const rippleTimerRef = useRef(0)
  const MAX_RIPPLES = 20
  const freezeRef = useRef(0)

  const rainValue = rain ?? weather.current.rain
  const tempValue = temp ?? weather.current.temperature

  const uniforms = useMemo(() => ({
    uWindDir: { value: new THREE.Vector2(Math.cos(windDir.current), Math.sin(windDir.current)) },
    uWindSpeed: { value: windSpd.current },
    uProgress: { value: 0 },
    uRippleCount: { value: 0 },
    uRipplePos: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector2()) },
    uRippleAge: { value: new Float32Array(MAX_RIPPLES) },
    uTemp: { value: 0 },
    uFreeze: { value: 0 },
    uWaveOffset: { value: 0 },
  }), [])

  useFrame((_, delta) => {
    delta = Math.min(delta, 0.05)
    const mat = materialRef.current
    if (!mat) return

    rippleTimerRef.current += delta

    if (rainValue) {
      const interval = Math.max(0.02, 0.15 / Math.sqrt(rainValue))

      if (rippleTimerRef.current > interval) {
        rippleTimerRef.current = 0
        const angle = Math.random() * Math.PI
        const radius = Math.sqrt(Math.random())
        ripplesRef.current.push({
          x: Math.cos(angle) * radius,
          y: -Math.sin(angle) * radius,
          age: 0
        })
      }
    }

    for (const ripple of ripplesRef.current) {
      ripple.age += delta
    }

    ripplesRef.current = ripplesRef.current.filter(ripple => ripple.age < 1.0)

    let targetFreeze = 0

    if (temp != null) {
      targetFreeze = THREE.MathUtils.clamp((0 - temp) / 5, 0, 1)
    }

    freezeRef.current = THREE.MathUtils.lerp(
      freezeRef.current,
      targetFreeze,
      1.0 - Math.exp(-0.3 * delta * 60)
    )

    waveOffset.current += delta * THREE.MathUtils.lerp(
      0.4,
      0.9,
      windSpd.current / 15
    )

    mat.uniforms.uWaveOffset.value = waveOffset.current
    mat.uniforms.uProgress.value = progress
    mat.uniforms.uWindDir.value = new THREE.Vector2(Math.cos(windDir.current), Math.sin(windDir.current))
    mat.uniforms.uWindSpeed.value = windSpd.current
    mat.uniforms.uRippleCount.value = ripplesRef.current.length
    mat.uniforms.uTemp.value = tempValue ?? 10
    mat.uniforms.uFreeze.value = freezeRef.current
    mat.uniforms.uWaveOffset.value = waveOffset.current

    for (let i = 0; i < MAX_RIPPLES; i++) {
      const ripple = ripplesRef.current[i]
      if (ripple) {
        mat.uniforms.uRipplePos.value[i].set(ripple.x, ripple.y)
        mat.uniforms.uRippleAge.value[i] = ripple.age
      }
    }
  })

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, param.groundPos[1], -1]}>
      <planeGeometry args={[param.groundRadius * 3.5, param.groundRadius * 3.5, 256, 256]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}