<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const isEditing = ref(false)
const formData = ref({
  name: '',
  year: '',
  department: ''
})

const user = computed(() => userStore.currentUser)

function startEditing() {
  if (user.value) {
    formData.value = {
      name: user.value.name,
      year: user.value.year,
      department: user.value.department
    }
    isEditing.value = true
  }
}

function saveProfile() {
  userStore.updateProfile(formData.value)
  isEditing.value = false
}

function logout() {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen pt-24 px-6 pb-20">
    <div class="max-w-2xl mx-auto">
      <div v-if="user" class="glass rounded-3xl p-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">个人资料</h2>
          <button 
            v-if="!isEditing"
            @click="startEditing" 
            class="btn-glass"
          >
            编辑资料
          </button>
        </div>

        <div class="flex items-center gap-6 mb-8">
          <div class="relative">
            <img 
              :src="user.avatar" 
              :alt="user.name"
              class="w-24 h-24 rounded-full bg-slate-800"
            >
            <div class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-800" />
          </div>
          <div>
            <h3 class="text-2xl font-bold">{{ user.name }}</h3>
            <p class="text-gray-400">{{ user.year }}级 · {{ user.department }}</p>
          </div>
        </div>

        <div v-if="isEditing" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">姓名</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">入学年份</label>
            <input
              v-model="formData.year"
              type="text"
              class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">院系</label>
            <input
              v-model="formData.department"
              type="text"
              class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div class="flex gap-3 pt-4">
            <button @click="saveProfile" class="btn-primary">保存</button>
            <button @click="isEditing = false" class="btn-glass">取消</button>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="glass rounded-xl p-4">
            <div class="text-sm text-gray-400 mb-1">邮箱</div>
            <div>{{ user.email }}</div>
          </div>
          <div class="glass rounded-xl p-4">
            <div class="text-sm text-gray-400 mb-1">注册时间</div>
            <div>{{ new Date(user.createdAt).toLocaleDateString() }}</div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-white/10">
          <button @click="logout" class="w-full py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors">
            退出登录
          </button>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-gray-400 mb-4">请先登录</p>
        <router-link to="/login" class="btn-primary inline-block">
          去登录
        </router-link>
      </div>
    </div>
  </div>
</template>
