import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([])
  const isAuthenticated = computed(() => currentUser.value !== null)

  function loadUsers() {
    const stored = localStorage.getItem('alumniUsers')
    if (stored) {
      users.value = JSON.parse(stored)
    }
  }

  function saveUsers() {
    localStorage.setItem('alumniUsers', JSON.stringify(users.value))
  }

  function checkSession() {
    const session = localStorage.getItem('alumniSession')
    if (session) {
      currentUser.value = JSON.parse(session)
    }
  }

  function login(email: string, password: string): boolean {
    const user = users.value.find(u => u.email === email)
    if (user) {
      currentUser.value = user
      localStorage.setItem('alumniSession', JSON.stringify(user))
      return true
    }
    return false
  }

  function register(userData: Omit<User, 'id' | 'createdAt'> & { password: string }): boolean {
    if (users.value.find(u => u.email === userData.email)) {
      return false
    }

    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      year: userData.year,
      department: userData.department,
      createdAt: new Date().toISOString()
    }

    users.value.push(newUser)
    saveUsers()
    currentUser.value = newUser
    localStorage.setItem('alumniSession', JSON.stringify(newUser))
    return true
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('alumniSession')
  }

  function updateProfile(updates: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates }
      localStorage.setItem('alumniSession', JSON.stringify(currentUser.value))
      
      const index = users.value.findIndex(u => u.id === currentUser.value!.id)
      if (index !== -1) {
        users.value[index] = currentUser.value
        saveUsers()
      }
    }
  }

  loadUsers()
  checkSession()

  return {
    currentUser,
    users,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  }
})
