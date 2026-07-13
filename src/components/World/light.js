import * as THREE from 'three'
import { useHelper } from "@react-three/drei"
import { useRef } from "react"
import { param, useIsDebug } from "@/lib/param"
import { useFrame } from "@react-three/fiber"
import { Streetlight } from "./Streetlight"

export default function Light({ progress, sun, snowDepth }) {
  const directionalLight = useRef()
  const isDebug = useIsDebug()
  const isDay = progress >= 0.25 && progress <= 0.75
  const intensity = useRef(0)

  useHelper(isDebug ? directionalLight : null, THREE.DirectionalLightHelper, 1)

  useFrame(() => {
    const light = directionalLight.current

    if (!light) return
    const target = isDay ? 4 * (1 - Math.pow((progress - 0.5) / 0.25, 2)) : 0

    intensity.current += (target - intensity.current) * 0.05
    light.intensity = intensity.current
    light.position.copy(sun)
    light.target.position.set(param.groundPos[0], param.groundPos[1], param.groundPos[2])
    light.target.updateMatrixWorld()
  })

  return (
    <>
      <directionalLight castShadow
        ref={directionalLight}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={param.sunRadius * 2}
        shadow-camera-left={-param.sunRadius}
        shadow-camera-right={param.sunRadius}
        shadow-camera-top={param.sunRadius}
        shadow-camera-bottom={-param.sunRadius}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      <ambientLight intensity={isDay ? 2 : 0.1} />

      <Streetlight progress={progress} snowDepth={snowDepth}/>
    </>
  )
}