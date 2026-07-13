import * as THREE from 'three'
import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { param } from "@/lib/param"
import trunkVertex from './shader/tree/trunkVertex.glsl'
import vertexShader from './shader/tree/vertexShader.glsl'
import fragmentShader from './shader/tree/fragmentShader.glsl'
import { useGLTF } from '@react-three/drei'

export default function Tree({ progress, windDir, windSpd, snowDepth }) {
  const { nodes, materials } = useGLTF('/models/tree.glb')

  const leafMaterialRef = useRef()
  const trunkMaterial = useMemo(() => materials.trunk.clone(), [materials])
  const trunkShaderRef = useRef()
  const snowRef = useRef()

  const geometry = nodes.Cube.geometry
  geometry.setAttribute(
    'windWeight',
    geometry.attributes.color_1
  )

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: progress },
    uWindSpeed: { value: 0 },
    uWindDir: { value: 0 },
    uSnowDepth: { value: 0 }
  }), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (!snowRef.current) return

    const targetPosY = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(
        snowDepth, 0, 0.5, -0.4, -0.199
      ), -0.4, -0.199
    )

    snowRef.current.position.y =
      THREE.MathUtils.lerp(
        snowRef.current.position.y,
        targetPosY,
        0.05
      )

    if (trunkShaderRef.current) {
      trunkShaderRef.current.uniforms.uTime.value = time
      trunkShaderRef.current.uniforms.uWindSpeed.value = windSpd.current
      trunkShaderRef.current.uniforms.uWindDir.value = windDir.current
    }

    if (leafMaterialRef.current) {
      leafMaterialRef.current.uniforms.uTime.value = time
      leafMaterialRef.current.uniforms.uProgress.value = progress
      leafMaterialRef.current.uniforms.uWindSpeed.value = windSpd.current
      leafMaterialRef.current.uniforms.uWindDir.value = windDir.current
      leafMaterialRef.current.uniforms.uSnowDepth.value = snowDepth
    }
  })

  useEffect(() => {
    trunkMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.uWindSpeed = { value: 0 }
      shader.uniforms.uWindDir = { value: 0 }

      shader.vertexShader =
        `
      uniform float uTime;
      uniform float uWindSpeed;
      uniform float uWindDir;

      attribute vec4 windWeight;
      ` + shader.vertexShader

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>

        float weight = windWeight.r;

        ${trunkVertex}
        `
      )

      trunkShaderRef.current = shader
    }

    trunkMaterial.needsUpdate = true
  }, [trunkMaterial])

  return (
    <group position={param.groundPos}>
      <group position={[-4.7, 0, -4]} scale={1.2} rotation-y={0.2}>
        <mesh
          ref={snowRef}
          castShadow
          receiveShadow
          geometry={nodes.snowTrunk.geometry}
          material={materials.snow}
          position={[0, -0.199, 0]}
          visible={snowDepth >= 0.1}
        />

        <group position={[0, -0.199, 0]}>
          <mesh castShadow receiveShadow
            geometry={nodes.Cube.geometry}
            material={trunkMaterial}
          />

          <mesh castShadow receiveShadow scale={1}
            geometry={nodes.Cube_1.geometry}
          >
            <shaderMaterial
              ref={leafMaterialRef}
              vertexColors
              uniforms={uniforms}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/tree.glb')