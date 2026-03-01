<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref<HTMLDivElement | null>(null)

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let animationId: number
let particles: Array<{
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}> = []

const particleCount = 80
const connectionDistance = 120

onMounted(() => {
  if (!container.value) return
  
  canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  canvas.style.inset = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.pointerEvents = 'none'
  
  ctx = canvas.getContext('2d')
  container.value.appendChild(canvas)
  
  resizeCanvas()
  createParticles()
  animate()
  
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
})

function resizeCanvas() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function createParticles() {
  particles = []
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.3,
      hue: Math.random() * 60 + 200
    })
  }
}

function animate() {
  if (!ctx || !canvas) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    
    p.x += p.speedX
    p.y += p.speedY
    
    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0
    if (p.y < 0) p.y = canvas.height
    if (p.y > canvas.height) p.y = 0
    
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dx = p.x - p2.x
      const dy = p.y - p2.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < connectionDistance) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(96, 165, 250, ${0.15 * (1 - distance / connectionDistance)})`
        ctx.lineWidth = 1
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
    
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
    gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.opacity})`)
    gradient.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`)
    
    ctx.fillStyle = gradient
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${p.opacity})`
    ctx.fill()
  }
  
  animationId = requestAnimationFrame(animate)
}
</script>

<template>
  <div 
    ref="container" 
    class="fixed inset-0 -z-10 bg-slate-900"
  />
</template>
