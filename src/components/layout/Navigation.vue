<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ProfilePanel from './ProfilePanel.vue'

const router = useRouter()
const userStore = useUserStore()

const isMenuOpen = ref(false)
const showProfile = ref(false)

const navItems = [
  { id: 'home', label: '首页', path: '/' },
  { id: 'timeline', label: '时光轴', path: '/timeline' },
  { id: 'radar', label: '缘分雷达', path: '/radar' },
  { id: 'classroom', label: '班级密室', path: '/classroom' }
]

const userName = computed(() => userStore.currentUser?.name || '登录')

function navigateTo(path: string) {
  router.push(path)
  isMenuOpen.value = false
}

function handleUserClick() {
  if (userStore.isAuthenticated) {
    showProfile.value = !showProfile.value
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3 cursor-pointer" @click="navigateTo('/')">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 flex items-center justify-center font-bold text-lg">
          时
        </div>
        <span class="font-bold text-xl hidden sm:block">时光纽带</span>
      </div>

      <div class="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="navigateTo(item.path)"
          class="nav-item px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-white/20"
          :class="{ 'bg-white/20': $route.path === item.path }"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <button @click="handleUserClick" class="flex items-center gap-2 glass rounded-full pl-1 pr-4 py-1 hover:bg-white/20 transition-all">
          <div class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-amber-500">
            <img 
              v-if="userStore.currentUser?.avatar"
              :src="userStore.currentUser.avatar" 
              :alt="userName"
              class="w-full h-full object-cover"
            >
          </div>
          <span class="text-sm font-medium hidden sm:block">{{ userName }}</span>
        </button>

        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 glass rounded-lg"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 -translate-y-4"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMenuOpen" class="md:hidden absolute top-full left-4 right-4 mt-2 glass rounded-2xl p-4">
        <div class="flex flex-col gap-2">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="navigateTo(item.path)"
            class="px-4 py-3 rounded-xl text-left hover:bg-white/20 transition-colors"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </Transition>

    <ProfilePanel v-if="showProfile" @close="showProfile = false" />
  </nav>
</template>
