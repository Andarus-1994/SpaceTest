import { useAnimations, useGLTF, useScroll, Environment } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Group } from "three"

useGLTF.preload("/sun.glb")

export default function Sun() {
  const group = useRef<Group>(null)
  const { nodes, materials, animations, scene } = useGLTF("/sun.glb")
  const { actions, clips } = useAnimations(animations, scene)

  const scroll = useScroll()

  useEffect(() => {
    console.log(materials)
    console.log(actions)
    console.log(nodes)
    //@ts-ignore
    actions["Take 001"].play().paused = true
  }, [])

  useFrame(
    () =>
      //@ts-ignore
      (actions["Take 001"].time =
        //@ts-ignore
        (actions["Take 001"].getClip().duration * scroll.offset) / 4)
  )

  return (
    <>
      <group ref={group}>
        <primitive object={scene} />
      </group>
    </>
  )
}
