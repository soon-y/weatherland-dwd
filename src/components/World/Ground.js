import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { param, useIsDebug } from '@/lib/param'
import { Bench } from './Bench'
import { useControls } from "leva"
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Post } from './post'

export default function WorldGround({ store, hourly, index }) {
  const { nodes, materials } = useGLTF('models/land.glb')

  const isDebug = useIsDebug()
  const [snowDepth, setSnowDepth] = useState(0)
  const snowRef = useRef()
  const snowRockRef = useRef()
  const snowRockRef1 = useRef()
  const snowRockRef2 = useRef()
  const snowRockRef3 = useRef()
  const snowRockRef4 = useRef()
  const snowRockRef5 = useRef()
  const snowRockRef6 = useRef()
  const snowRockRef7 = useRef()
  const snowRockRef8 = useRef()
  const snowRockRef9 = useRef()
  const snowRockRef10 = useRef()
  const snowRockRef11 = useRef()
  const snowRockRef12 = useRef()
  const snowRockRef13 = useRef()
  const snowRockRef14 = useRef()
  const snowRockRef15 = useRef()
  const snowRockRef16 = useRef()
  const snowRockRef17 = useRef()
  const snowRockRef18 = useRef()
  const snowRockRef19 = useRef()
  const snowRockRef20 = useRef()
  const snowRockRef21 = useRef()
  const snowRockRef22 = useRef()
  const snowColor = "#e8edf5"

  const snowRockRefs = [
    snowRockRef, snowRockRef1, snowRockRef2, snowRockRef3, snowRockRef4, snowRockRef5, snowRockRef6, snowRockRef7, snowRockRef8,
    snowRockRef9, snowRockRef10, snowRockRef11, snowRockRef12, snowRockRef13, snowRockRef14, snowRockRef15,
    snowRockRef16, snowRockRef17, snowRockRef18, snowRockRef19, snowRockRef20, snowRockRef21, snowRockRef22
  ]

  const { depth } = useControls('Snow', {
    depth: { value: 0.01, min: 0, max: 0.5, step: 0.01 },
  }, { store })

  useEffect(() => {
    if (isDebug) {
      setSnowDepth(depth)
      return
    }

    if (!hourly || index == null) return

    setSnowDepth(hourly.metrics.precip_snow_amount_1h.forecast[index])
  }, [isDebug, depth, hourly, index])

  useFrame(() => {
    if (!snowRef.current) return

    const targetPosY = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(
        snowDepth, 0, 0.5, -0.03, 0
      ), -0.03, 0
    )

    snowRef.current.position.y =
      THREE.MathUtils.lerp(
        snowRef.current.position.y,
        targetPosY,
        0.05
      )

    const targetScale = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(snowDepth, 0, 0.5, 0.4, 0.93), 0.4, 0.93
    )

    snowRockRefs.forEach(ref => {
      if (!ref.current) return

      ref.current.scale.x = THREE.MathUtils.lerp(
        ref.current.scale.x,
        targetScale,
        0.05
      )

      ref.current.scale.z = THREE.MathUtils.lerp(
        ref.current.scale.z,
        targetScale,
        0.05
      )
    })
  })

  return (
    <group dispose={null} scale={param.groundRadius * 2} position={param.groundPos}>
      <mesh
        ref={snowRockRef}
        castShadow
        receiveShadow
        geometry={nodes.snowRock.geometry}
        material={materials.snow}
        position={[-0.259, 0.07, -0.002]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef2}
        castShadow
        receiveShadow
        geometry={nodes.snowRock002.geometry}
        material={materials.snow}
        position={[0.302, 0.067, 0.012]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef3}
        castShadow
        receiveShadow
        geometry={nodes.snowRock003.geometry}
        material={materials.snow}
        position={[-0.062, 0.071, 0.027]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef1}
        castShadow
        receiveShadow
        geometry={nodes.snowRock001.geometry}
        material={materials.snow}
        position={[0.126, 0.068, 0.023]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef4}
        castShadow
        receiveShadow
        geometry={nodes.snowRock004.geometry}
        material={materials.snow}
        position={[0.486, 0.056, -0.028]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef5}
        castShadow
        receiveShadow
        geometry={nodes.snowRock005.geometry}
        material={materials.snow}
        position={[0.752, 0.07, 0.055]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef6}
        castShadow
        receiveShadow
        geometry={nodes.snowRock006.geometry}
        material={materials.snow}
        position={[0.646, 0.058, 0.369]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef7}
        castShadow
        receiveShadow
        geometry={nodes.snowRock007.geometry}
        material={materials.snow}
        position={[0.41, 0.073, 0.648]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef8}
        castShadow
        receiveShadow
        geometry={nodes.snowRock008.geometry}
        material={materials.snow}
        position={[0.093, 0.063, 0.784]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef9}
        castShadow
        receiveShadow
        geometry={nodes.snowRock009.geometry}
        material={materials.snow}
        position={[-0.221, 0.074, 0.745]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef10}
        castShadow
        receiveShadow
        geometry={nodes.snowRock010.geometry}
        material={materials.snow}
        position={[-0.543, 0.064, 0.546]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef11}
        castShadow
        receiveShadow
        geometry={nodes.snowRock011.geometry}
        material={materials.snow}
        position={[-0.686, 0.069, 0.325]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef12}
        castShadow
        receiveShadow
        geometry={nodes.snowRock012.geometry}
        material={materials.snow}
        position={[-0.739, 0.069, 0.029]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef13}
        castShadow
        receiveShadow
        geometry={nodes.snowRock013.geometry}
        material={materials.snow}
        position={[-0.612, 0.063, -0.054]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef14}
        castShadow
        receiveShadow
        geometry={nodes.snowRock014.geometry}
        material={materials.snow}
        position={[-0.473, 0.061, -0.072]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef15}
        castShadow
        receiveShadow
        geometry={nodes.snowRock015.geometry}
        material={materials.snow}
        position={[-0.737, 0.073, 0.169]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef16}
        castShadow
        receiveShadow
        geometry={nodes.snowRock016.geometry}
        material={materials.snow}
        position={[-0.633, 0.072, 0.45]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef17}
        castShadow
        receiveShadow
        geometry={nodes.snowRock017.geometry}
        material={materials.snow}
        position={[-0.389, 0.07, 0.667]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef18}
        castShadow
        receiveShadow
        geometry={nodes.snowRock018.geometry}
        material={materials.snow}
        position={[-0.06, 0.073, 0.783]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef19}
        castShadow
        receiveShadow
        geometry={nodes.snowRock019.geometry}
        material={materials.snow}
        position={[0.257, 0.068, 0.75]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef20}
        castShadow
        receiveShadow
        geometry={nodes.snowRock020.geometry}
        material={materials.snow}
        position={[0.557, 0.072, 0.519]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef21}
        castShadow
        receiveShadow
        geometry={nodes.snowRock021.geometry}
        material={materials.snow}
        position={[0.754, 0.071, 0.231]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>
      <mesh
        ref={snowRockRef22}
        castShadow
        receiveShadow
        geometry={nodes.snowRock022.geometry}
        material={materials.snow}
        position={[0.626, 0.063, -0.057]}
        scale={[0.929, 0.1, 0.929]}
        visible={snowDepth >= 0.1}
      >
        <meshStandardMaterial color={snowColor} roughness={1} metalness={0} />
      </mesh>

      <mesh
        ref={snowRef}
        castShadow
        receiveShadow
        geometry={nodes.snow.geometry}
        material={materials.snow}
        position={[-0.003, -0.03, -0.001]}
        scale={1.017}
        visible={snowDepth >= 0.1}
      />

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.ground.geometry}
        material={materials.groundLand}
        position={[0, -0.406, 0]}
        scale={0.847}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.rock002.geometry}
        material={materials.rock}
        position={[0, 0.037, -0.102]}
        scale={[0.929, 0.1, 0.929]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.rock001.geometry}
        material={materials.rock}
        position={[0, 0.037, -0.102]}
        scale={[0.929, 0.1, 0.929]}
      />

      <Bench snowDepth={snowDepth} />
      <Post snowDepth={snowDepth} />
    </group>
  )
}

useGLTF.preload('models/land.glb')