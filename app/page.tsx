import dynamic from "next/dynamic"

const Canvas = dynamic(() => import("@/Components/Canvas"), { ssr: false })

export default function Home() {
  return (
    <main className="h-full bg-gray-200">
      <Canvas />
    </main>
  )
}
