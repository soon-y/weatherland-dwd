import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { param } from '@/lib/param'

const MAX_COUNT = 5000
const AREA = 100
const HEIGHT = 30

export default function Rain({ windDir, windSpd, precipitation, isDay, weather }) {
  const rainValue = precipitation ?? weather.current.rain
  const meshRef = useRef()

  const dummy = useMemo(
    () => new THREE.Object3D(), []
  )

  const drops = useMemo(() => {
    return Array.from(
      { length: MAX_COUNT },
      () => ({
        x: (Math.random() - 0.5) * AREA,
        y: Math.random() * HEIGHT,
        z: (Math.random() - 0.5) * AREA,
        speed: 10 + Math.random() * 8
      })
    )
  }, [])

  useFrame((_, delta) => {
    delta = Math.min(delta, 0.05)
    if (!meshRef.current) return

    if (rainValue <= 0) {
      meshRef.current.count = 0
      return
    }

    const dir = windDir.current
    const wind = windSpd.current
    const visibleCount = Math.min(
      MAX_COUNT,
      Math.floor(
        Math.sqrt(rainValue) * 400
      )
    )

    const windX = Math.cos(dir) * wind * 0.25
    const windZ = Math.sin(dir) * wind * 0.25
    const tilt = Math.min(wind * 0.015, 0.6)

    for (let i = 0; i < visibleCount; i++) {
      const drop = drops[i]

      drop.y -= drop.speed * delta
      drop.x += windX * delta
      drop.z += windZ * delta

      if (drop.y < param.groundPos[1]) {
        drop.y = HEIGHT
        drop.x = (Math.random() - 0.5) * AREA
        drop.z = (Math.random() - 0.5) * AREA
      }

      dummy.position.set(drop.x, drop.y, drop.z)
      dummy.rotation.set(-tilt * Math.sin(dir), 0, tilt * Math.cos(dir))

      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.count = visibleCount
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, MAX_COUNT]}
      frustumCulled={false}
    >
      <cylinderGeometry args={[0.008, 0.008, 0.5, 4]} />

      <meshBasicMaterial
        color={isDay ? "#5b859c" : "#dcefff"}
        transparent
        opacity={0.35}
      />
    </instancedMesh>
  )
}