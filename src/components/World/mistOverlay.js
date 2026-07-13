import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uStrength;
uniform float uTime;
uniform float uIsDay;

varying vec2 vUv;

float random(vec2 st){
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;

  float n =
    random(uv * 20.0 + uTime * 0.02) * 0.5 +
    random(uv * 10.0 - uTime * 0.01) * 0.5;

  float alpha = n * uStrength * 0.5;

vec3 dayColor = vec3(0.65, 0.68, 0.72);
vec3 nightColor = vec3(0.03, 0.04, 0.06);

  vec3 color = mix(nightColor, dayColor, uIsDay);

  gl_FragColor = vec4(color, alpha);
}
`

export default function MistOverlay({ visibility, isDay, weather }) {
  const meshRef = useRef()
  const matRef = useRef()
  const visibilityValue = visibility ?? weather.current.visibility

  const { camera } = useThree()

  const uniforms = useMemo(
    () => ({
      uStrength: { value: 0 },
      uTime: { value: 0 },
      uIsDay: { value: 0 }
    }),
    []
  )

  useFrame((_, delta) => {
    delta = Math.min(delta, 0.05)
    if (!meshRef.current || !matRef.current) return

    matRef.current.uniforms.uTime.value += delta
    matRef.current.uniforms.uIsDay.value = isDay ? 1 : 0

    const mistStrength = THREE.MathUtils.clamp(
      (3000 - visibilityValue) / 3000,
      0,
      1
    )

    matRef.current.uniforms.uStrength.value = mistStrength

    meshRef.current.position.copy(camera.position)

    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)

    meshRef.current.position.add(
      forward.multiplyScalar(2)
    )

    meshRef.current.quaternion.copy(camera.quaternion)
  })

  return (
    <mesh ref={meshRef} renderOrder={9999}>
      <planeGeometry args={[4, 4]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}