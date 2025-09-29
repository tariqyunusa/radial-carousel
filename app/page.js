"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"

const images = [
  "/gradient-1.jpg","/gradient-2.jpg","/gradient-3.jpg",
  "/gradient-4.jpg","/gradient-5.jpg","/gradient-6.jpg",
  "/gradient-7.jpg","/gradient-8.jpg","/gradient-9.jpg",
]

function Roundcarousel() {
  const textures = useTexture(images)        
  const meshRefs = useRef([])               
  const rotation = useRef(0)                
  const velocity = useRef(0)                
  const { gl } = useThree()

  const radius = 22
  const angleStep = (2 * Math.PI) / images.length

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
   
      velocity.current += -e.deltaY * 0.002
    }
    gl.domElement.addEventListener("wheel", handleWheel, { passive: false })
    return () => gl.domElement.removeEventListener("wheel", handleWheel)
  }, [gl])


  useFrame(() => {
    rotation.current += velocity.current
    velocity.current *= 0.92 

    for (let i = 0; i < images.length; i++) {
      const m = meshRefs.current[i]
      if (!m) continue

      const angle = i * angleStep + rotation.current
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      m.position.set(x, y, 0)     
      m.rotation.set(0, 0, 0)      
    }
  })

  return (
    <group>
      {textures.map((tex, i) => {
        const initX = Math.cos(i * angleStep) * radius
        const initY = Math.sin(i * angleStep) * radius

        return (
          <mesh
            key={i}
            ref={(el) => (meshRefs.current[i] = el)}
            position={[initX, initY, 0]}
            rotation={[0, 0, 0]}
          >
            <planeGeometry args={[8, 12]} />
            <meshBasicMaterial map={tex} transparent />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Home() {
  return (
    <section className="w-screen h-screen bg-white">
      <Canvas orthographic camera={{ position: [0, 0, 5], zoom: 13 }}>
        <Roundcarousel />
      </Canvas>
    </section>
  )
}
