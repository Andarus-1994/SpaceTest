import dynamic from "next/dynamic"

const Canvas = dynamic(() => import("@/components/Canvas"), { ssr: false })

export default function Home() {
  return (
    <main className="h-full bg-gray-200">
      <Canvas />
    </main>
  )
}
