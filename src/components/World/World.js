import { OrbitControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { levaStore } from 'leva'
import { param, useIsDebug } from "@/lib/param"
import DebugUI from "../debugUI"
import { useEffect, useState, Suspense } from "react"
import WorldGround from "./Ground"
import Environment from "./environment"
import Loading from "@/components/loading"
import { Perf } from "r3f-perf"
import * as THREE from 'three'

function World({ hourly, daily, index }) {
  const [indexD, setIndexD] = useState(0)
  const isDebug = useIsDebug()

  useEffect(() => {
    if (!hourly || index == null) return
    setIndexD(Math.floor(index / 24))
  }, [hourly, index])

  return <>
    <DebugUI store={levaStore} />
    <Canvas shadows camera={{
      fov: 50,
      near: 0.01,
      far: 100,
      position: param.camPos,
    }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.shadowMap.enabled = true
        gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}
    >
      {isDebug && <Perf position="top-left" />}
      <Suspense fallback={<Loading />}>
        <OrbitControls
          target={param.worldPos}
          maxDistance={50}
          minDistance={isDebug ? 0 : 20}
          maxPolarAngle={isDebug ? Math.PI * 0.5 : Math.PI * 0.5}
          minPolarAngle={isDebug ? 0 : Math.PI * 0.3}
          enableDamping
          dampingFactor={0.03}
        />

        <CameraController />

        <group position={param.worldPos}>
          <Environment store={levaStore} hourly={hourly} daily={daily} index={index} indexD={indexD} />
          <WorldGround store={levaStore} hourly={hourly} index={index} />
        </group>
      </Suspense>
    </Canvas>
  </>
}

function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768

      if (isMobile) {
        const width = window.innerWidth
        const scale = Math.max(1, 600 / width)

        camera.position.set(
          param.camPos[0] * scale,
          param.camPos[1] * scale,
          param.camPos[2] * scale,)
      } else {
        camera.position.set(...param.camPos)
      }

      camera.updateProjectionMatrix()
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [camera])

  return null
}

export default World