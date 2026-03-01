<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const stats = [
  { value: 328, label: '个班级', color: 'text-blue-400' },
  { value: 56, label: '场即将举行的活动', color: 'text-amber-400' },
  { value: 1204, label: '位同城校友', color: 'text-purple-400' }
]

const totalAlumni = ref(12580)
const searchQuery = ref('')
const isSearchActive = ref(false)

function activateSearch() {
  isSearchActive.value = true
}

function deactivateSearch() {
  isSearchActive.value = false
  searchQuery.value = ''
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    console.log('Searching:', searchQuery.value)
  }
}

onMounted(() => {
  gsap.fromTo('.hero-badge', 
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  )
  
  gsap.fromTo('.hero-title', 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
  )
  
  gsap.fromTo('.hero-subtitle',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
  )
  
  gsap.fromTo('.search-orb',
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)' }
  )
  
  gsap.fromTo('.stat-card',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.8, ease: 'power2.out' }
  )

  const counter = document.querySelector('.counter')
  if (counter) {
    let current = 0
    const target = totalAlumni.value
    const duration = 2000
    const step = target / (duration / 16)
    
    const updateCounter = () => {
      current += step
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString()
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target.toLocaleString()
      }
    }
    
    setTimeout(updateCounter, 1000)
  }
})
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-900/80 z-10" />
      <img 
        src="/graduate.png" 
        alt="背景"
        class="absolute inset-0 w-full h-full object-cover opacity-40"
      />
    </div>

    <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
      <div class="hero-badge mb-8 inline-block">
        <span class="glass px-6 py-2 rounded-full text-sm text-blue-200 border-blue-400/30">
          ✨ 已有 <span class="text-amber-400 font-bold text-lg counter">{{ totalAlumni.toLocaleString() }}</span> 位校友回家
        </span>
      </div>
      
      <h1 class="hero-title font-serif-sc text-5xl md:text-7xl font-bold mb-6 leading-tight">
        重逢，在<span class="gradient-text">时光</span>的<br>每一个节点
      </h1>
      
      <p class="hero-subtitle text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
        不仅是通讯录，更是连接过去与未来的数字纽带。<br>
        在这里，每一次相遇都是久别重逢。
      </p>

      <div class="flex justify-center mb-16">
        <div 
          class="search-orb relative cursor-pointer transition-all duration-500 flex items-center justify-center"
          :class="{ 'active': isSearchActive }"
          @click="activateSearch"
        >
          <svg v-if="!isSearchActive" class="w-6 h-6 text-white search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <Transition
            enter-active-class="transition-all duration-300"
            leave-active-class="transition-all duration-200"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <input
              v-if="isSearchActive"
              v-model="searchQuery"
              type="text"
              placeholder="搜索校友、班级、年级或回忆..."
              class="w-full bg-transparent border-none outline-none text-white text-lg px-6"
              @keypress.enter="handleSearch"
              @blur="deactivateSearch"
              autofocus
            />
          </Transition>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div 
          class="stat-card glass rounded-2xl p-6 cursor-pointer group hover:bg-white/20 transition-all duration-500 floating"
        >
          <div class="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform text-blue-400">
            {{ stats[0].value }}
          </div>
          <div class="text-sm text-gray-400">{{ stats[0].label }}</div>
          <div class="mt-4 flex -space-x-2">
            <img class="w-8 h-8 rounded-full border-2 border-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" alt="">
            <img class="w-8 h-8 rounded-full border-2 border-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" alt="">
            <img class="w-8 h-8 rounded-full border-2 border-slate-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" alt="">
            <div class="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs">+</div>
          </div>
        </div>
        
        <div 
          class="stat-card glass rounded-2xl p-6 cursor-pointer group hover:bg-white/20 transition-all duration-500 floating-delayed"
        >
          <div class="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform text-amber-400">
            {{ stats[1].value }}
          </div>
          <div class="text-sm text-gray-400">{{ stats[1].label }}</div>
          <div class="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-blue-500 to-amber-500 w-3/4 rounded-full" />
          </div>
        </div>
        
        <div 
          class="stat-card glass rounded-2xl p-6 cursor-pointer group hover:bg-white/20 transition-all duration-500 floating"
        >
          <div class="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform text-purple-400">
            {{ stats[2].value.toLocaleString() }}
          </div>
          <div class="text-sm text-gray-400">{{ stats[2].label }}</div>
          <div class="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>128位当前在线</span>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.search-orb {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.4), rgba(245, 158, 11, 0.4));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 40px rgba(96, 165, 250, 0.5);
}

.search-orb:hover {
  box-shadow: 0 0 60px rgba(96, 165, 250, 0.8);
}

.search-orb.active {
  width: 600px;
  height: 60px;
  border-radius: 30px;
  max-width: 90vw;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

.floating {
  animation: float 6s ease-in-out infinite;
}

.floating-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 3s;
}
</style>
