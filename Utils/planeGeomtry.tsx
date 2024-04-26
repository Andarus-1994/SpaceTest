import { PlaneGeometry, Float32BufferAttribute } from "three"

export default function createRoundedPlaneGeometry(width: number, height: number, radius: number) {
  const geometry = new PlaneGeometry(width, height, 32, 32)

  const vertices = []

  const halfWidth = width / 2
  const halfHeight = height / 2

  // Define the number of segments for the rounded corners
  const segments = 32

  // Define the angle step for each segment
  const angleStep = (Math.PI * 2) / segments

  // Create the rounded corners
  for (let i = 0; i <= segments; i++) {
    const angle = angleStep * i
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    vertices.push(x + halfWidth, y + halfHeight, 0) // Top right corner
  }

  // Set the vertices attribute
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3))

  return geometry
}
