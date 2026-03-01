<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const userStore = useUserStore()

function logout() {
  userStore.logout()
  emit('close')
  router.push('/')
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 scale-95"
    leave-to-class="opacity-0 scale-95"
  >
    <div class="fixed top-20 right-6 z-50 glass rounded-2xl p-6 w-80">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 p-[2px]">
          <img 
            :src="userStore.currentUser?.avatar" 
            class="w-full h-full rounded-full bg-slate-800"
          >
        </div>
        <div>
          <h4 class="font-bold text-lg">{{ userStore.currentUser?.name }}</h4>
          <p class="text-sm text-gray-400">
            {{ userStore.currentUser?.department }} {{ userStore.currentUser?.year }}级
          </p>
        </div>
      </div>

      <div class="space-y-2 mb-6">
        <router-link 
          to="/profile" 
          @click="emit('close')"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>个人资料</span>
        </router-link>
        
        <a href="#" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>设置</span>
        </a>
        
        <a href="#" class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>消息</span>
          <span class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
        </a>
      </div>

      <button 
        @click="logout"
        class="w-full py-3 glass rounded-xl font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-red-400"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        退出登录
      </button>
    </div>
  </Transition>
</template>
