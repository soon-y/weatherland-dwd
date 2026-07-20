import { useGLTF } from '@react-three/drei'
import { param, useIsDebug } from '@/lib/param'
import { Bench } from './Bench'
import { Post } from './post'

export default function WorldGround({ store, forecast, index }) {
  const { nodes, materials } = useGLTF('models/land.glb')

  return (
    <group dispose={null} scale={param.groundRadius * 2} position={param.groundPos}>      
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

      <Bench />
      <Post />
    </group>
  )
}

useGLTF.preload('models/land.glb')