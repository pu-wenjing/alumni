<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const formData = ref({
  name: '',
  email: '',
  password: '',
  year: '2020',
  department: '计算机系'
})

const departments = ['计算机系', '外语系', '数学系', '物理系', '化学系']
const years = Array.from({ length: 20 }, (_, i) => String(2024 - i))

function toggleForm() {
  isLogin.value = !isLogin.value
}

function handleSubmit() {
  if (isLogin.value) {
    const success = userStore.login(formData.value.email, formData.value.password)
    if (success) {
      router.push('/')
    } else {
      alert('邮箱或密码错误')
    }
  } else {
    const success = userStore.register({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      year: formData.value.year,
      department: formData.value.department
    })
    if (success) {
      router.push('/')
    } else {
      alert('该邮箱已被注册')
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-6 py-20">
    <div class="glass rounded-3xl p-8 max-w-md w-full">
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-amber-400 flex items-center justify-center font-bold text-3xl">
          时
        </div>
        <h3 class="text-2xl font-bold">{{ isLogin ? '欢迎回来' : '加入校友录' }}</h3>
        <p class="text-sm text-gray-400 mt-1">{{ isLogin ? '登录你的校友账号' : '创建你的校友账号' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <label class="block text-sm text-gray-400 mb-2">姓名</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="你的真实姓名"
            required
          >
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">邮箱</label>
          <input
            v-model="formData.email"
            type="email"
            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="your@email.com"
            required
          >
        </div>

        <div>
          <label class="block text-sm text-gray-400 mb-2">密码</label>
          <input
            v-model="formData.password"
            type="password"
            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
            required
          >
        </div>

        <div v-if="!isLogin" class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm text-gray-400 mb-2">入学年份</label>
            <select
              v-model="formData.year"
              class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option v-for="year in years" :key="year" :value="year">{{ year }}级</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">院系</label>
            <select
              v-model="formData.department"
              class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
        </div>

        <button type="submit" class="w-full btn-primary mt-6">
          {{ isLogin ? '登录' : '注册' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          {{ isLogin ? '还没有账号？' : '已有账号？' }}
          <a href="#" @click.prevent="toggleForm" class="text-blue-400 hover:text-blue-300">
            {{ isLogin ? '立即注册' : '立即登录' }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
