import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Theme } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  const themes: Theme[] = [
    { name: 'dark', label: '暗色模式' },
    { name: 'light', label: '亮色模式' }
  ]

  const currentTheme = ref<'light' | 'dark'>('dark')

  function loadTheme() {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      currentTheme.value = stored
    }
    applyTheme()
  }

  function setTheme(theme: 'light' | 'dark') {
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
    applyTheme()
  }

  function toggleTheme() {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  function applyTheme() {
    if (currentTheme.value === 'light') {
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
    } else {
      document.body.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
    }
  }

  loadTheme()

  return {
    themes,
    currentTheme,
    setTheme,
    toggleTheme
  }
})
