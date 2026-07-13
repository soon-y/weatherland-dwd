import * as THREE from 'three'
import { Sky } from "@react-three/drei"
import { useRef } from "react"
import { param } from "@/lib/param"
import { useFrame } from "@react-three/fiber"
import Light from "./light"

export default function WorldSky({ progress, snowDepth }) {
  const skyRayleigh = useRef(0)
  const skyRef = useRef()
  const sun = useRef(new THREE.Vector3())

  useFrame(() => {
    const sky = skyRef.current
    if (!sky) return

    let targetRayleigh = getRayValue(progress)
  
    const pos = getSunPosition(progress)
    sun.current.fromArray(pos)

    skyRayleigh.current += (targetRayleigh - skyRayleigh.current) * 0.05
    sky.material.uniforms.rayleigh.value = skyRayleigh.current
    
    sky.material.uniforms.sunPosition.value.copy(sun.current)
  })

  return (
    <>
      <Sky
        ref={skyRef}
        mieCoefficient={0}
        mieDirectionalG={0.3}
      />

      <Light progress={progress} sun={sun.current} snowDepth={snowDepth}/>
    </>
  )
}

function getSunPosition(progress) {
  const angle = progress * Math.PI * 2 - Math.PI / 2
  const radius = param.sunRadius
  return [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius,
    0 
  ]
}

function getRayValue(progress) {
  if (progress <= 0.25) {
    return 10 - (8 * (progress / 0.25))
  }

  if (progress <= 0.75) {
    const t = (progress - 0.25) / 0.5
    return 2 - 1.8 * (1 - Math.cos(Math.PI * t)) / 2
  }

  const t = (progress - 0.75) / 0.25
  return 2 + (8 * t)
}