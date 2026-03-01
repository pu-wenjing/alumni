import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MemoryCapsule } from '@/types'

export const useCapsuleStore = defineStore('capsule', () => {
  const capsules = ref<MemoryCapsule[]>([])

  function loadCapsules() {
    const stored = localStorage.getItem('memoryCapsules')
    if (stored) {
      capsules.value = JSON.parse(stored)
    }
  }

  function saveCapsules() {
    localStorage.setItem('memoryCapsules', JSON.stringify(capsules.value))
  }

  function addCapsule(capsule: Omit<MemoryCapsule, 'id' | 'createdAt' | 'sealed'>) {
    const newCapsule: MemoryCapsule = {
      ...capsule,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      sealed: true
    }
    capsules.value.push(newCapsule)
    saveCapsules()
    return newCapsule
  }

  function openCapsule(id: number) {
    const capsule = capsules.value.find(c => c.id === id)
    if (capsule) {
      capsule.sealed = false
      saveCapsules()
    }
  }

  function deleteCapsule(id: number) {
    capsules.value = capsules.value.filter(c => c.id !== id)
    saveCapsules()
  }

  function canOpen(capsule: MemoryCapsule): boolean {
    return new Date() >= new Date(capsule.openAt)
  }

  loadCapsules()

  return {
    capsules,
    addCapsule,
    openCapsule,
    deleteCapsule,
    canOpen
  }
})
