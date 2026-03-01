<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTimelineStore } from '@/stores/timeline'
import type { TimelineNode } from '@/types'
import gsap from 'gsap'

const timelineStore = useTimelineStore()

const showModal = ref(false)
const editingNode = ref<TimelineNode | null>(null)
const scrollProgress = ref(0)

const formData = ref({
  year: new Date().getFullYear(),
  title: '',
  description: '',
  icon: '📅',
  color: 'blue',
  tags: [] as string[],
  images: [] as string[]
})

const icons = ['📅', '🎓', '💼', '🎉', '❤️', '🏠', '✈️', '🏆']
const colors = ['blue', 'purple', 'amber', 'green', 'pink', 'red']

const defaultNodes: TimelineNode[] = [
  {
    id: '1',
    year: 2010,
    title: '入学报到',
    description: '拖着行李箱走进校门，遇见了即将共度四年的室友。那天阳光很好，蝉鸣很吵。',
    icon: '🎓',
    color: 'blue',
    tags: ['计算机系', '宿舍201'],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80',
      'https://images.unsplash.com/photo-1562774053-701939374585?w=200&q=80'
    ]
  },
  {
    id: '2',
    year: 2014,
    title: '毕业典礼',
    description: '穿着学士服在图书馆前合影，说好不哭，结果拥抱时还是红了眼眶。约定十年后再见。',
    icon: '🎓',
    color: 'amber',
    tags: ['毕业', '十年之约'],
    images: [],
    hasCapsule: true
  },
  {
    id: '3',
    year: 2018,
    title: '职场进阶',
    description: '从初级工程师晋升为技术主管，感谢在校期间打下的坚实基础。正在招聘学弟学妹！',
    icon: '💼',
    color: 'purple',
    tags: ['晋升', '内推'],
    images: []
  },
  {
    id: '4',
    year: 2024,
    title: '十年之约',
    description: '毕业十周年聚会筹备中，已有45位同学确认参加。期待重逢！',
    icon: '🎉',
    color: 'amber',
    tags: ['聚会', '重逢'],
    images: [],
    isActive: true
  }
]

function openAddModal() {
  formData.value = {
    year: new Date().getFullYear(),
    title: '',
    description: '',
    icon: '📅',
    color: 'blue',
    tags: [],
    images: []
  }
  editingNode.value = null
  showModal.value = true
}

function openEditModal(node: TimelineNode) {
  formData.value = { ...node, tags: node.tags || [], images: node.images || [] }
  editingNode.value = node
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingNode.value = null
}

function saveNode() {
  if (editingNode.value) {
    timelineStore.updateNode(editingNode.value.id, formData.value)
  } else {
    timelineStore.addNode(formData.value)
  }
  closeModal()
}

function deleteNode() {
  if (editingNode.value) {
    timelineStore.deleteNode(editingNode.value.id)
    closeModal()
  }
}

function handleScroll() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = (scrollTop / docHeight) * 100
}

onMounted(() => {
  if (timelineStore.nodes.length === 0) {
    defaultNodes.forEach(node => timelineStore.addNode(node))
  }

  gsap.from('.timeline-header', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  })
  
  gsap.from('.timeline-node', {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.3,
    ease: 'power2.out'
  })

  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="relative py-32 bg-slate-900/50 min-h-screen">
    <div class="max-w-6xl mx-auto px-6">
      <div class="timeline-header text-center mb-20">
        <h2 class="font-serif-sc text-4xl md:text-5xl font-bold mb-4">
          人生<span class="gradient-text">时光轴</span>
        </h2>
        <p class="text-gray-400">记录每一个重要节点，连接过去与未来</p>
      </div>

      <div class="flex justify-end mb-8">
        <button @click="openAddModal" class="btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加节点
        </button>
      </div>

      <div class="timeline-container relative">
        <div class="timeline-line" />
        <div class="timeline-progress" :style="{ height: scrollProgress + '%' }" />

        <div
          v-for="(node, index) in timelineStore.sortedNodes"
          :key="node.id"
          class="timeline-node"
          :class="{ 'active': node.isActive }"
        >
          <div 
            class="timeline-dot"
            :class="{ 'active': node.isActive }"
            @click="openEditModal(node)"
          />
          
          <div 
            class="timeline-content glass hover-card"
            :class="index % 2 === 0 ? 'left' : 'right'"
            @click="openEditModal(node)"
          >
            <div class="text-amber-400 text-sm font-bold mb-2">{{ node.year }}年</div>
            <h3 class="text-2xl font-bold mb-3">{{ node.title }}</h3>
            <p class="text-gray-300 mb-4">{{ node.description }}</p>
            
            <div 
              v-if="node.tags && node.tags.length > 0"
              class="flex gap-2 mb-4 flex-wrap"
              :class="index % 2 === 0 ? 'justify-end' : 'justify-start'"
            >
              <span 
                v-for="tag in node.tags" 
                :key="tag"
                class="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300"
              >
                {{ tag }}
              </span>
            </div>

            <div 
              v-if="node.images && node.images.length > 0"
              class="grid grid-cols-3 gap-2"
            >
              <img 
                v-for="(img, imgIndex) in node.images.slice(0, 2)" 
                :key="imgIndex"
                :src="img" 
                class="rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer object-cover h-20"
                alt="Memory"
              >
              <div 
                v-if="node.images.length > 2"
                class="rounded-lg bg-slate-800 flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-slate-700 transition-colors"
              >
                +{{ node.images.length - 2 }}
              </div>
            </div>

            <div 
              v-if="node.hasCapsule"
              class="memory-capsule sealed mt-4 inline-block"
            >
              <span class="text-sm">💌 致2024年的自己</span>
              <div class="text-xs text-gray-400 mt-1">将于2024年6月1日开启</div>
            </div>

            <div 
              v-if="node.isActive"
              class="flex gap-3 mt-4"
            >
              <button class="flex-1 py-3 bg-gradient-to-r from-blue-500 to-amber-500 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1">
                确认参加
              </button>
              <button class="flex-1 py-3 glass rounded-xl font-bold hover:bg-white/20 transition-all">
                也许参加
              </button>
            </div>
          </div>
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
          <h3 class="text-2xl font-bold mb-6">
            {{ editingNode ? '编辑节点' : '添加节点' }}
          </h3>

          <form @submit.prevent="saveNode" class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">年份</label>
              <input
                v-model.number="formData.year"
                type="number"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">标题</label>
              <input
                v-model="formData.title"
                type="text"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                placeholder="事件标题"
              >
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">描述</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="详细描述..."
              />
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">图标</label>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="icon in icons"
                  :key="icon"
                  type="button"
                  @click="formData.icon = icon"
                  class="w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors"
                  :class="formData.icon === icon ? 'bg-blue-500' : 'bg-slate-800/50 hover:bg-slate-700'"
                >
                  {{ icon }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-400 mb-2">颜色</label>
              <div class="flex gap-2">
                <button
                  v-for="color in colors"
                  :key="color"
                  type="button"
                  @click="formData.color = color"
                  class="w-8 h-8 rounded-full transition-transform"
                  :class="[`bg-${color}-500`, formData.color === color ? 'scale-125 ring-2 ring-white' : '']"
                />
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="submit" class="flex-1 btn-primary">
                {{ editingNode ? '保存' : '添加' }}
              </button>
              <button 
                v-if="editingNode"
                type="button"
                @click="deleteNode"
                class="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
              >
                删除
              </button>
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

<style scoped>
.timeline-container {
  position: relative;
  min-height: 100vh;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-50%);
}

.timeline-progress {
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  background: linear-gradient(to bottom, #60a5fa, #f59e0b);
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.8);
  transition: height 0.1s ease-out;
}

.timeline-node {
  position: relative;
  margin: 100px 0;
}

.timeline-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1e293b;
  border: 3px solid #60a5fa;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 rgba(96, 165, 250, 0.4);
}

.timeline-dot:hover {
  transform: translateX(-50%) scale(1.5);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.8);
}

.timeline-dot.active {
  background: #f59e0b;
  border-color: #f59e0b;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.8);
}

.timeline-content {
  width: 40%;
  padding: 30px;
  border-radius: 20px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.timeline-content:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
}

.timeline-content.left {
  margin-left: 5%;
  text-align: right;
}

.timeline-content.right {
  margin-left: 55%;
  text-align: left;
}

.memory-capsule {
  position: relative;
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(245, 158, 11, 0.2));
  border-radius: 50px;
  padding: 15px 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
}

.memory-capsule:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.memory-capsule.sealed::before {
  content: '🔒';
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

@media (max-width: 768px) {
  .timeline-content {
    width: 80% !important;
    margin-left: 10% !important;
    text-align: left !important;
  }
  
  .timeline-dot {
    left: 5%;
  }
  
  .timeline-line,
  .timeline-progress {
    left: 5%;
  }
}
</style>
