import * as THREE from 'three'
import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { param } from "@/lib/param"
import vertexShader from './shader/grass/vertexShader.glsl'
import fragmentShader from './shader/grass/fragmentShader.glsl'

export default function Grass({ progress, windDir, windSpd, snowDepth }) {
  const count = 5000
  const grassRef = useRef()
  const bladesPerTuft = 4
  const total = count * bladesPerTuft
  const grassHeight = 0.3

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.12, grassHeight, 1, 6)
    g.translate(0, 0.5, 0)

    const randoms = new Float32Array(total)

    for (let i = 0; i < total; i++) {
      randoms[i] = Math.random()
    }

    g.setAttribute(
      'aRandom',
      new THREE.InstancedBufferAttribute(randoms, 1)
    )
    return g
  }, [])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uWindDir: { value: new THREE.Vector2(Math.cos(windDir.current), -Math.sin(windDir.current)) },
        uWindSpeed: { value: windSpd.current },
        uProgress: { value: 0 },
        uSnowDepth: { valeu: snowDepth }
      },
      side: THREE.DoubleSide
    })
  }, [])

  useEffect(() => {
    if (!grassRef.current) return

    const temp = new THREE.Object3D()

    for (let i = 0; i < count; i++) {
      let x, z

      while (true) {
        x = (Math.random() - 0.5) * param.groundRadius * 4
        z = (Math.random() - 0.5) * param.groundRadius * 4

        const dist = Math.sqrt(x * x + z * z)
        if (dist > param.groundRadius * 2 - 0.4) continue

        const pondZ = param.pondPos[2]
        const pondRadius = param.pondRadius * 2

        const dz = z - pondZ

        const inCircle = dist < pondRadius
        const inHalf = dz > 0

        if (inCircle && inHalf) continue

        break
      }

      for (let j = 0; j < bladesPerTuft; j++) {
        const id = i * bladesPerTuft + j

        temp.position.set(
          x + (Math.random() - 0.5),
          0,
          z + (Math.random() - 0.5)
        )

        temp.rotation.y = Math.random() * Math.PI
        temp.scale.setScalar(0.8 + Math.random() * 0.6)

        temp.updateMatrix()
        grassRef.current.setMatrixAt(id, temp.matrix)
      }
    }

    grassRef.current.instanceMatrix.needsUpdate = true
  }, [count])

  useFrame((state) => {
    grassRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
    grassRef.current.material.uniforms.uProgress.value = progress
    grassRef.current.material.uniforms.uWindDir.value = new THREE.Vector2(Math.cos(windDir.current), -Math.sin(windDir.current))
    grassRef.current.material.uniforms.uWindSpeed.value = windSpd.current
    grassRef.current.material.uniforms.uSnowDepth.value = snowDepth
  })

  return (
    <group position={param.groundPos}>
      <instancedMesh ref={grassRef} args={[geometry, material, total]} position-y={-grassHeight} />
    </group>
  )
}