<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const messages = ref<Array<{ id: number; text: string; isUser: boolean }>>([
  { id: 1, text: '你好！我是时光助手，有什么可以帮助你的吗？', isUser: false }
])
const inputMessage = ref('')

function toggleChat() {
  isOpen.value = !isOpen.value
}

function sendMessage() {
  if (!inputMessage.value.trim()) return
  
  messages.value.push({
    id: Date.now(),
    text: inputMessage.value,
    isUser: true
  })
  
  inputMessage.value = ''
  
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      text: '收到你的消息了！这是一个演示回复。',
      isUser: false
    })
  }, 1000)
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div v-if="isOpen" class="mb-4 w-80 glass rounded-2xl overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-amber-500 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                💬
              </div>
              <div>
                <h4 class="font-bold">时光助手</h4>
                <p class="text-xs text-white/80">在线</p>
              </div>
            </div>
            <button @click="isOpen = false" class="text-white/80 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="h-64 overflow-y-auto p-4 space-y-3">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="message.isUser ? 'justify-end' : 'justify-start'"
          >
            <div 
              class="max-w-[80%] px-4 py-2 rounded-2xl text-sm"
              :class="message.isUser ? 'bg-blue-500 text-white rounded-br-md' : 'bg-white/10 rounded-bl-md'"
            >
              {{ message.text }}
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-white/10">
          <form @submit.prevent="sendMessage" class="flex gap-2">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="输入消息..."
              class="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
            <button type="submit" class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>
    
    <button 
      @click="toggleChat"
      class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 flex items-center justify-center shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all transform hover:scale-110"
    >
      <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
