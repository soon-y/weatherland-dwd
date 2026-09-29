import { OrbitControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { levaStore } from 'leva'
import { param, useIsDebug } from "@/lib/param"
import DebugUI from "../debugUI"
import { useEffect, useState, Suspense, useRef } from "react"
import WorldGround from "./Ground"
import Environment from "./environment"
import Loading from "@/components/loading"
import { Perf, usePerf } from "r3f-perf"
import * as THREE from 'three'

function World({ forecast, index }) {
  const [indexD, setIndexD] = useState(0)
  const isDebug = useIsDebug()
  const levaValuesRef = useRef({})

  useEffect(() => {
    if (!forecast || index == null) return
    setIndexD(Math.floor(index / 24))
  }, [forecast, index])

  return (
    <>
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
            <Environment store={levaStore} forecast={forecast} index={index} indexD={indexD} levaValuesRef={levaValuesRef} />
            <WorldGround store={levaStore} forecast={forecast} index={index} />
          </group>
        </Suspense>
      </Canvas>
      {isDebug && <PerformanceButton
        levaValues={levaValuesRef}
      />}
    </>)
}

function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    const handleResize = () => {
      const scale = Math.max(1, 600 / window.innerWidth)

      camera.position.set(
        param.camPos[0] * scale,
        param.camPos[1] * scale,
        param.camPos[2] * scale
      )
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [camera])

  return null
}

function PerformanceButton({ levaValues }) {
  const getReport = usePerf((state) => state.getReport)

  const handleClick = () => {
    const report = getReport()

    if (!report) {
      alert('No performance result yet.')
      return
    }

    const recordedAt = new Date().toISOString()

    const content = [
      'WeatherLand Performance Report',
      `Recorded at: ${recordedAt}`,
      `Browser: ${navigator.userAgent}`,
      `Viewport: ${window.innerWidth} x ${window.innerHeight}`,
      `Device pixel ratio: ${window.devicePixelRatio}`,
      '',
      '--- Leva Settings ---',
      JSON.stringify(levaValues, null, 2),
      '',
      '--- Performance Results ---',
      JSON.stringify(report, null, 2),
    ].join('\n')

    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `weatherland-performance-${recordedAt.replace(/[:.]/g, '-')}.txt`

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <button
      className="absolute bottom-4 left-4 z-50 px-3 py-2 bg-black text-white rounded"
      onClick={handleClick}
    >
      Download performance report
    </button>
  )
}

export default World