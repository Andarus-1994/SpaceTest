import { useAnimations, useGLTF, useScroll, Environment, Text3D } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group, MeshStandardMaterial, Mesh, Vector3, Line } from "three"
import createRoundedPlaneGeometry from "../Utils/planeGeomtry"
import createLightRay from "@/Utils/lightRay"

useGLTF.preload("/water_orb.glb")

export default function Water() {
  const group = useRef<Group>(null)
  const textRef = useRef<typeof Text3D | null>(null)
  const { nodes, materials, animations, scene } = useGLTF("/water_orb.glb")
  const { actions, clips } = useAnimations(animations, scene)

  const scroll = useScroll()

  useEffect(() => {
    console.log(materials)
    console.log(actions)
    console.log(nodes)
    //@ts-ignore
    actions["RootAction"].play().paused = true
    console.log(nodes["Object_5"])
  }, [])

  useFrame(() => {
    if (actions && actions["RootAction"]) {
      actions["RootAction"].time = (actions["RootAction"].getClip().duration * scroll.offset) / 4
    }
    if (nodes && nodes["Object_5"]) {
      nodes["Object_5"].position.y = 1 - scroll.offset * 4.5 // Adjust as needed
      nodes["Object_5"].position.x = -6 - scroll.offset * -10.5 // Adjust as needed
      nodes["Object_5"].position.z = -5 - scroll.offset * 3.5
      nodes["Object_5"].rotation.x = 5 // No rotation around X-axis
      nodes["Object_5"].rotation.y = Math.PI // Rotate 90 degrees around Y-axis (horizontal)
      nodes["Object_5"].rotation.z = 5 + scroll.offset * 5 // No rotation around Z-axis
    }
  })

  useEffect(() => {
    // Apply material directly to the object in the scene
    scene.traverse((child) => {
      if ((child as Mesh).isMesh && child.name === "Object_5") {
        const meshChild = child as Mesh
        meshChild.material = new MeshStandardMaterial({
          color: "#5a5c5e",
          roughness: 1,
          transparent: false,
        })
      }
      if ((child as Mesh).isMesh && child.name === "Object_7") {
        const meshChild = child as Mesh
        meshChild.material = new MeshStandardMaterial({
          color: "#2d2c2a",
          roughness: 1,
          transparent: false,
        })
      }
    })
  }, [scene])

  const waterMeshRef = useRef<Mesh | null>(null)
  const waterMesh2Ref = useRef<Mesh | null>(null)

  const waterGeometry = createRoundedPlaneGeometry(10, 10, 2)
  console.log(waterGeometry)
  useEffect(() => {
    const waterMaterial = new MeshStandardMaterial({
      color: "#3e81c8",
      transparent: true,
      opacity: 1,
      roughness: 0.2,
      metalness: 0.7,
    })

    const waterMesh = new Mesh(waterGeometry, waterMaterial)
    const waterMesh2 = new Mesh(waterGeometry, waterMaterial)

    waterMesh.position.set(0, -5, -12)
    waterMesh.rotation.x = -Math.PI / 3

    waterMesh2.position.set(0, -6, -12)
    waterMesh2.rotation.x = -Math.PI / 3

    scene.add(waterMesh)
    scene.add(waterMesh2)
    waterMeshRef.current = waterMesh
    waterMesh2Ref.current = waterMesh2
    return () => {
      // Clean up
      scene.remove(waterMesh)
      waterMesh.geometry.dispose()
      waterMesh.material.dispose()
    }
  }, [scene, waterGeometry])

  useFrame(() => {
    if (waterMeshRef.current) {
      waterMeshRef.current.position.y = scroll.offset
      waterMeshRef.current.position.x = scroll.offset * -10
      waterMeshRef.current.rotation.x = -4 - scroll.offset * 2
      waterMeshRef.current.rotation.y = -Math.PI * scroll.offset
      waterMeshRef.current.rotation.z = 0
    }
    if (waterMesh2Ref.current) {
      waterMesh2Ref.current.position.y = scroll.offset
      waterMesh2Ref.current.position.x = scroll.offset * -10
      waterMesh2Ref.current.rotation.x = -4 - scroll.offset * 3
      waterMesh2Ref.current.rotation.y = -Math.PI * scroll.offset
      waterMesh2Ref.current.rotation.z = 0
    }

    if (lightRef.current && nodes && nodes["Object_5"] && nodes["Object_7"]) {
      const startPoint = new Vector3(nodes["Object_7"].position.x, nodes["Object_7"].position.y, nodes["Object_7"].position.z)
      const endPoint = new Vector3(nodes["Object_5"].position.x, nodes["Object_5"].position.y, nodes["Object_5"].position.z)
      lightRef.current.geometry.attributes.position.setXYZ(1, startPoint.x, startPoint.y, startPoint.z)
      lightRef.current.geometry.attributes.position.setXYZ(0, endPoint.x, endPoint.y, endPoint.z)
      lightRef.current.geometry.attributes.position.needsUpdate = true
    }
    if (textRef.current) {
      textRef.current.position.set(scroll.offset * -5 - 6, scroll.offset + 4, -scroll.offset * 7)
      textRef.current.scale.x = 0.5
      textRef.current.fontSize = 1
    }
  })

  const lightRef = useRef<Line | null>(null)

  useEffect(() => {
    // Create the light ray
    console.log(textRef)
    const startPoint = new Vector3(0, 0, 0)
    const endPoint = new Vector3(-30, 5, -50)
    const lightRay = createLightRay(startPoint, endPoint)
    scene.add(lightRay)
    lightRef.current = lightRay
    // Return cleanup function to remove light ray
    return () => {
      scene.remove(lightRay)
    }
  }, [scene])

  return (
    <>
      <group ref={group}>
        <primitive object={scene} />
        <Text3D ref={textRef} font="./fonts/helvetiker_regular.typeface.json" fontSize={1} color="#6a6f6f" castShadow>
          Two.
        </Text3D>
      </group>

      <Environment preset="studio" />
    </>
  )
}
