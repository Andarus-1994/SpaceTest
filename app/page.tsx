"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"

const Canvas = dynamic(() => import("@/Components/Canvas"), { ssr: false })

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <main className="h-full bg-gray-200">
      <Canvas />
    </main>
  )
}
