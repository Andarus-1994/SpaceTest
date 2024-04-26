"use client"

import { Canvas } from "@react-three/fiber"
import Water from "./Water"
import { Suspense } from "react"
import { useProgress, Html, ScrollControls } from "@react-three/drei"
import Sun from "./Sun"

function Loader() {
  const { progress } = useProgress()

  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 4]} className="relative h-svh bg-black">
      <directionalLight position={[0, 50, 51]} intensity={4} />
      <Suspense fallback={<Loader />}>
        <ScrollControls damping={0.5} pages={5}>
          <Sun />
          <Water />
        </ScrollControls>
      </Suspense>
    </Canvas>
  )
}
