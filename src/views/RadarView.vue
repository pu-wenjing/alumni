<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Alumni } from '@/types'
import gsap from 'gsap'

const alumniList = ref<Alumni[]>([
  { id: 1, name: '李明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liming', year: '2010', department: '计算机系', location: { lat: 39.9, lng: 116.4, city: '北京' }, distance: 0, online: true },
  { id: 2, name: '王芳', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang', year: '2010', department: '外语系', location: { lat: 31.2, lng: 121.5, city: '上海' }, distance: 1200, online: true },
  { id: 3, name: '张伟', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangwei', year: '2011', department: '数学系', location: { lat: 23.1, lng: 113.3, city: '广州' }, distance: 1800, online: false },
  { id: 4, name: '刘洋', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liuyang', year: '2010', department: '物理系', location: { lat: 30.6, lng: 104.1, city: '成都' }, distance: 1500, online: false },
  { id: 5, name: '陈静', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenjing', year: '2012', department: '化学系', location: { lat: 30.5, lng: 114.3, city: '武汉' }, distance: 1000, online: true },
])

const selectedAlumni = ref<Alumni | null>(null)
const maxDistance = ref(2000)
const mapLoaded = ref(false)
const mapError = ref(false)

const filteredAlumni = ref(alumniList.value)

function filterByDistance(max: number) {
  maxDistance.value = max
  filteredAlumni.value = alumniList.value.filter(a => a.distance <= max)
}

function selectAlumni(alumni: Alumni) {
  selectedAlumni.value = alumni
}

onMounted(() => {
  gsap.from('.radar-card', {
    opacity: 0,
    scale: 0.9,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  })
  
  setTimeout(() => {
    mapLoaded.value = true
  }, 1000)
})
</script>

<template>
  <div class="min-h-screen pt-24 px-6 pb-20">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">缘分雷达</span>
        </h1>
        <p class="text-gray-400">发现附近的校友</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="glass rounded-3xl overflow-hidden h-[500px] relative">
            <div v-if="!mapLoaded" class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p class="text-gray-400">加载地图中...</p>
              </div>
            </div>
            
            <div v-else-if="mapError" class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-6xl mb-4">🗺️</div>
                <p class="text-gray-400">地图加载失败</p>
                <p class="text-sm text-gray-500 mt-2">请检查网络连接</p>
              </div>
            </div>
            
            <div v-else class="relative w-full h-full bg-slate-800/50">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="relative">
                  <div class="w-64 h-64 rounded-full border border-blue-500/30 animate-ping absolute inset-0" />
                  <div class="w-48 h-48 rounded-full border border-blue-500/50 animate-pulse absolute inset-8" />
                  <div class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/20 to-amber-500/20 absolute inset-16 flex items-center justify-center">
                    <span class="text-4xl">📍</span>
                  </div>
                </div>
              </div>

              <div 
                v-for="alumni in filteredAlumni" 
                :key="alumni.id"
                class="absolute w-10 h-10 cursor-pointer hover:scale-125 transition-transform"
                :style="{ 
                  left: `${20 + Math.random() * 60}%`, 
                  top: `${20 + Math.random() * 60}%` 
                }"
                @click="selectAlumni(alumni)"
              >
                <img :src="alumni.avatar" class="w-full h-full rounded-full border-2" :class="alumni.online ? 'border-green-500' : 'border-gray-500'">
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="glass rounded-2xl p-6">
            <h3 class="font-bold mb-4">距离筛选</h3>
            <div class="flex gap-2 flex-wrap">
              <button 
                @click="filterByDistance(500)"
                class="px-4 py-2 rounded-xl text-sm transition-colors"
                :class="maxDistance === 500 ? 'bg-blue-500' : 'glass hover:bg-white/20'"
              >
                500km内
              </button>
              <button 
                @click="filterByDistance(1000)"
                class="px-4 py-2 rounded-xl text-sm transition-colors"
                :class="maxDistance === 1000 ? 'bg-blue-500' : 'glass hover:bg-white/20'"
              >
                1000km内
              </button>
              <button 
                @click="filterByDistance(2000)"
                class="px-4 py-2 rounded-xl text-sm transition-colors"
                :class="maxDistance === 2000 ? 'bg-blue-500' : 'glass hover:bg-white/20'"
              >
                不限
              </button>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h3 class="font-bold mb-4">附近校友 ({{ filteredAlumni.length }})</h3>
            <div class="space-y-3 max-h-80 overflow-y-auto">
              <div
                v-for="alumni in filteredAlumni"
                :key="alumni.id"
                class="radar-card flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                @click="selectAlumni(alumni)"
              >
                <div class="relative">
                  <img :src="alumni.avatar" class="w-12 h-12 rounded-full">
                  <span 
                    v-if="alumni.online"
                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium">{{ alumni.name }}</p>
                  <p class="text-sm text-gray-400">{{ alumni.department }} · {{ alumni.year }}级</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-400">{{ alumni.location.city }}</p>
                  <p class="text-xs text-gray-500">{{ alumni.distance }}km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="selectedAlumni" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="selectedAlumni = null" />
        
        <div class="relative glass rounded-3xl p-8 max-w-sm w-full text-center">
          <img :src="selectedAlumni.avatar" class="w-24 h-24 rounded-full mx-auto mb-4">
          <h3 class="text-2xl font-bold mb-2">{{ selectedAlumni.name }}</h3>
          <p class="text-gray-400 mb-1">{{ selectedAlumni.department }} · {{ selectedAlumni.year }}级</p>
          <p class="text-sm text-gray-500 mb-6">{{ selectedAlumni.location.city }} · {{ selectedAlumni.distance }}km</p>
          
          <div class="flex gap-3">
            <button class="flex-1 btn-primary">发送消息</button>
            <button class="flex-1 btn-glass" @click="selectedAlumni = null">关闭</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
