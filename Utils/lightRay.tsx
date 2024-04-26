import { Line, BufferGeometry, Float32BufferAttribute, Vector3, MeshBasicMaterial } from "three"

export default function createLightRay(startPoint: Vector3, endPoint: Vector3) {
  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new Float32BufferAttribute([startPoint.x, startPoint.y, startPoint.z, endPoint.x, endPoint.y, endPoint.z], 3))

  const material = new MeshBasicMaterial({ color: 0xffff00 })
  const line = new Line(geometry, material)
  return line
}
