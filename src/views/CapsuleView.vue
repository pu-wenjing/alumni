<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCapsuleStore } from '@/stores/capsule'
import gsap from 'gsap'

const capsuleStore = useCapsuleStore()

const showModal = ref(false)
const selectedCapsule = ref<number | null>(null)

const formData = ref({
  title: '',
  content: '',
  openDate: '',
  recipients: [] as string[]
})

function openCreateModal() {
  formData.value = {
    title: '',
    content: '',
    openDate: '',
    recipients: []
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function createCapsule() {
  if (!formData.value.title || !formData.value.content || !formData.value.openDate) return
  
  capsuleStore.createCapsule({
    title: formData.value.title,
    content: formData.value.content,
    openDate: formData.value.openDate,
    recipients: formData.value.recipients
  })
  
  closeModal()
}

function openCapsule(id: number) {
  selectedCapsule.value = id
}

function isCapsuleOpenable(openDate: string): boolean {
  return new Date(openDate) <= new Date()
}

onMounted(() => {
  gsap.from('.capsule-header', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  })
  
  gsap.from('.capsule-card', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.2,
    ease: 'power2.out'
  })
})
</script>

<template>
  <div class="relative py-32 min-h-screen">
    <div class="max-w-6xl mx-auto px-6">
      <div class="capsule-header text-center mb-16">
        <h2 class="font-serif-sc text-4xl md:text-5xl font-bold mb-4">
          记忆<span class="gradient-text">胶囊</span>
        </h2>
        <p class="text-gray-400">封存此刻的记忆，在未来某天开启</p>
      </div>

      <div class="flex justify-end mb-8">
        <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          创建胶囊
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="capsule in capsuleStore.capsules"
          :key="capsule.id"
          class="capsule-card glass rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-500 group"
          @click="openCapsule(capsule.id)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="text-4xl">
              {{ isCapsuleOpenable(capsule.openDate) ? '📦' : '🔒' }}
            </div>
            <span 
              class="px-3 py-1 rounded-full text-xs"
              :class="isCapsuleOpenable(capsule.openDate) ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'"
            >
              {{ isCapsuleOpenable(capsule.openDate) ? '可开启' : '封存中' }}
            </span>
          </div>
          
          <h3 class="text-xl font-bold mb-2">{{ capsule.title }}</h3>
          <p class="text-sm text-gray-400 mb-4 line-clamp-2">{{ capsule.content }}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>开启日期: {{ capsule.openDate }}</span>
            <span>{{ capsule.recipients.length }} 位收件人</span>
          </div>
        </div>

        <div 
          class="glass rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-white/20 transition-all"
          @click="openCreateModal"
        >
          <div class="text-4xl mb-2">✨</div>
          <p class="text-gray-400">创建新胶囊</p>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="closeModal" />
        
        <div class="relative glass rounded-3xl p-8 max-w-md w-full">
          <h3 class="text-2xl font-bold mb-6">创建记忆胶囊</h3>

          <form @submit.prevent="createCapsule" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">标题</label>
              <input
                v-model="formData.title"
                type="text"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                placeholder="给这个记忆起个名字"
                required
              >
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">内容</label>
              <textarea
                v-model="formData.content"
                rows="4"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="写下你想封存的记忆..."
                required
              />
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">开启日期</label>
              <input
                v-model="formData.openDate"
                type="date"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                required
              >
            </div>

            <div class="flex gap-3 pt-4">
              <button type="submit" class="flex-1 btn-primary">封存胶囊</button>
              <button 
                type="button"
                @click="closeModal"
                class="px-6 py-3 glass rounded-xl hover:bg-white/20 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
