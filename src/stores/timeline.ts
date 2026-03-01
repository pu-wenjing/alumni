import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TimelineNode } from '@/types'

export const useTimelineStore = defineStore('timeline', () => {
  const nodes = ref<TimelineNode[]>([])
  const activeNode = ref<TimelineNode | null>(null)

  const sortedNodes = computed(() => 
    [...nodes.value].sort((a, b) => a.year - b.year)
  )

  function loadNodes() {
    const stored = localStorage.getItem('timelineNodes')
    if (stored) {
      nodes.value = JSON.parse(stored)
    }
  }

  function saveNodes() {
    localStorage.setItem('timelineNodes', JSON.stringify(nodes.value))
  }

  function addNode(node: Omit<TimelineNode, 'id'>) {
    const newNode: TimelineNode = {
      ...node,
      id: Date.now().toString()
    }
    nodes.value.push(newNode)
    saveNodes()
  }

  function updateNode(id: string, updates: Partial<TimelineNode>) {
    const index = nodes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates }
      saveNodes()
    }
  }

  function deleteNode(id: string) {
    nodes.value = nodes.value.filter(n => n.id !== id)
    saveNodes()
  }

  function setActiveNode(node: TimelineNode | null) {
    activeNode.value = node
  }

  loadNodes()

  return {
    nodes,
    activeNode,
    sortedNodes,
    addNode,
    updateNode,
    deleteNode,
    setActiveNode
  }
})
