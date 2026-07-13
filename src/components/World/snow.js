import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { param } from '@/lib/param'

const MAX_COUNT = 3000
const AREA = 100
const HEIGHT = 40
const groundY = param.groundPos[1]

export default function Snow({ windDir, windSpd, precipitation, isDay, weather }) {
  const snowValue = precipitation ?? weather.current.snow
  const meshRef = useRef()

  const dummy = useMemo(
    () => new THREE.Object3D(), [])

  const flakes = useMemo(() => {
    return Array.from(
      { length: MAX_COUNT },
      () => ({
        x: (Math.random() - 0.5) * AREA,
        y: Math.random() * HEIGHT,
        z: (Math.random() - 0.5) * AREA,

        speed: 0.3 + Math.random() * 0.7,
        drift: Math.random() * Math.PI * 2,
        size: 0.02 + Math.pow(Math.random(), 2) * 0.12
      })
    )
  }, [])

  useFrame((state, delta) => {
    delta = Math.min(delta, 0.05)
    if (!meshRef.current) return

    if (snowValue <= 0) {
      meshRef.current.count = 0
      return
    }

    const time = state.clock.elapsedTime
    const dir = windDir.current
    const wind = windSpd.current

    const dynamicArea = 120 + wind * 8

    const visibleCount = Math.min(
      MAX_COUNT,
      Math.floor(Math.pow(snowValue, 0.8) * 600)
    )

    const windEffect = Math.min(wind, 15)
    const windX = Math.cos(dir) * windEffect * 0.08
    const windZ = Math.sin(dir) * windEffect * 0.08

    const spawnOffsetX = -Math.cos(dir) * dynamicArea * 0.5
    const spawnOffsetZ = -Math.sin(dir) * dynamicArea * 0.5

    for (let i = 0; i < visibleCount; i++) {
      const snow = flakes[i]

      snow.y -= snow.speed * delta

      const sway = Math.sin(time * 0.8 + snow.drift) * (0.8 + wind * 0.08)

      snow.x += (windX + sway) * delta
      snow.z += windZ * delta

      if (
        snow.y < groundY ||
        Math.abs(snow.x) > dynamicArea ||
        Math.abs(snow.z) > dynamicArea
      ) {
        snow.y = HEIGHT
        snow.x = spawnOffsetX + (Math.random() - 0.5) * dynamicArea * 0.5
        snow.z = spawnOffsetZ + (Math.random() - 0.5) * dynamicArea * 0.5
      }

      dummy.position.set(snow.x, snow.y, snow.z)
      dummy.scale.setScalar(snow.size)
      dummy.lookAt(state.camera.position)

      dummy.updateMatrix()

      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.count = visibleCount

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const texture = useLoader(THREE.TextureLoader, '/textures/snowflake.png')
  const textureD = useLoader(THREE.TextureLoader, '/textures/snowflakeD.png')

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, MAX_COUNT]}
      frustumCulled={false}
    >
      <planeGeometry args={[3, 3]} />

      <meshBasicMaterial
        map={isDay ? textureD : texture}
        transparent
        alphaTest={0.1}
      />

    </instancedMesh>
  )
}