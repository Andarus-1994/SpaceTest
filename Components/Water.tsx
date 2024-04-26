import { useAnimations, useGLTF, useScroll, Environment } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { Group, MeshStandardMaterial, Mesh, Vector3, Line } from "three"
import createRoundedPlaneGeometry from "../Utils/planeGeomtry"
import createLightRay from "@/Utils/lightRay"

useGLTF.preload("/water_orb.glb")

export default function Water() {
  const group = useRef<Group>(null)
  const { nodes, materials, animations, scene } = useGLTF("/water_orb.glb")
  const { actions, clips } = useAnimations(animations, scene)

  const scroll = useScroll()

  useEffect(() => {
    console.log(materials)
    console.log(actions)
    console.log(nodes)
    //@ts-ignore
    actions["RootAction"].play().paused = true
  }, [])

  useFrame(() => {
    if (actions && actions["RootAction"]) {
      actions["RootAction"].time = (actions["RootAction"].getClip().duration * scroll.offset) / 4
    }
    if (nodes && nodes["Object_5"]) {
      nodes["Object_5"].position.y = 1 - scroll.offset * 0.5 // Adjust as needed
      nodes["Object_5"].position.x = -6 - scroll.offset * -10.5 // Adjust as needed
      nodes["Object_5"].position.z = -5 - scroll.offset * 2.5
      nodes["Object_5"].rotation.x = 5 // No rotation around X-axis
      nodes["Object_5"].rotation.y = Math.PI // Rotate 90 degrees around Y-axis (horizontal)
      nodes["Object_5"].rotation.z = 5 // No rotation around Z-axis
    }
  })

  useEffect(() => {
    // Apply material directly to the object in the scene
    scene.traverse((child) => {
      if (child.isMesh) {
        // Check if the child is a mesh
        child.material = new MeshStandardMaterial({
          color: "#5a5c5e", // Example color
          roughness: 1, // Set roughness to a high value
          transparent: true, // Enable transparency
        })
      }
    })
  }, [scene])

  const waterMeshRef = useRef<Mesh | null>(null)

  const waterGeometry = createRoundedPlaneGeometry(10, 10, 2)
  console.log(waterGeometry)
  useEffect(() => {
    // Apply water material to the water geometry
    const waterMaterial = new MeshStandardMaterial({
      color: "#3e81c8", // Example color
      transparent: true, // Enable transparency
      opacity: 0.7, // Adjust opacity as needed
      roughness: 0.5, // Adjust roughness for a more water-like appearance
      metalness: 0.5, // Adjust metalness for a more water-like appearance
    })

    const waterMesh = new Mesh(waterGeometry, waterMaterial)
    // Position and rotate the water mesh as needed
    waterMesh.position.set(0, -5, -12) // Example position
    waterMesh.rotation.x = -Math.PI / 3 // Rotate to lay flat

    scene.add(waterMesh) // Add water mesh to the scene
    waterMeshRef.current = waterMesh

    return () => {
      // Clean up
      scene.remove(waterMesh)
      waterMesh.geometry.dispose()
      waterMesh.material.dispose()
    }
  }, [scene, waterGeometry])

  useFrame(() => {
    if (waterMeshRef.current) {
      waterMeshRef.current.position.y = scroll.offset * -2
      waterMeshRef.current.position.x = scroll.offset * -10
      waterMeshRef.current.rotation.x = -4 - scroll.offset * 2 // No rotation around X-axis
      waterMeshRef.current.rotation.y = -Math.PI * scroll.offset // Rotate 90 degrees around Y-axis (horizontal)
      waterMeshRef.current.rotation.z = 0 // No rotation around Z-axis
    }

    if (scroll.offset > 0) {
      if (lightRayRef.current) {
        lightRayRef.current.visible = false
      }
    } else {
      console.log("show it")
      if (lightRayRef.current) {
        lightRayRef.current.visible = true
      }
    }
  })

  const lightRayRef = useRef<Line | null>(null)
  useEffect(() => {
    // Create the light ray
    console.log("Scroll offset:", scroll.offset)

    const startPoint = new Vector3(0, 0, 0)
    const endPoint = new Vector3(-30, 5, -50)
    const lightRay = createLightRay(startPoint, endPoint)
    scene.add(lightRay)
    lightRayRef.current = lightRay
    // Return cleanup function to remove light ray
    return () => {
      scene.remove(lightRay)
    }
  }, [scene])

  return (
    <>
      <group ref={group}>
        <primitive object={scene} />
      </group>
      <Environment preset="studio" />
    </>
  )
}
