"use client"

import { Canvas } from "@react-three/fiber"
import Water from "./Water"
import { Suspense, useEffect } from "react"
import { useProgress, Html, ScrollControls, Environment } from "@react-three/drei"
import Galaxy from "./Galaxy"

function Loader() {
  const { progress } = useProgress()

  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {
  return (
    <Canvas gl={{ antialias: true }} dpr={[1, 4]} className="relative h-svh" style={{ background: "black" }}>
      <ambientLight intensity={0} />
      <directionalLight position={[0, 50, 51]} intensity={2} />
      <Suspense fallback={<Loader />}>
        <ScrollControls damping={0.5} pages={3} horizontal style={{ opacity: 0 }}>
          <Water />
          <Galaxy />
        </ScrollControls>
      </Suspense>
      <Environment preset="studio" />
    </Canvas>
  )
}
