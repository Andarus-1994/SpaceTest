import { useAnimations, useGLTF, useScroll } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Group } from "three"

useGLTF.preload("/galaxy.glb")

export default function Sun() {
  const group = useRef<Group>(null)
  const { nodes, materials, animations, scene } = useGLTF("/galaxy.glb")
  const { actions, clips } = useAnimations(animations, scene)

  const scroll = useScroll()

  useEffect(() => {
    if (actions["Action"]) actions["Action"].play().paused = true
  }, [])

  useFrame(() => {
    if (actions["Action"]) {
      actions["Action"].time =
        //@ts-ignore
        (actions["Action"].getClip().duration * scroll.offset) / 4
    }
  })

  return (
    <>
      <group ref={group} scale={0.1}>
        <primitive object={scene} />
      </group>
    </>
  )
}
