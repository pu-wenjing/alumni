<script setup lang="ts">
import { ref, computed } from 'vue'

interface Student {
  id: number
  name: string
  avatar: string
  isOnline: boolean
  hasMessage: boolean
}

interface Classroom {
  id: number
  name: string
  members: number
  avatar: string
  lastActivity: string
  description: string
  teacher: { name: string; avatar: string; isOnline: boolean }
  students: Student[]
  confirmed: number
  pending: number
  declined: number
  photos: string[]
  messages: { from: string; time: string; content: string }[]
}

const classrooms = ref<Classroom[]>([
  { 
    id: 1, 
    name: '计算机科学与技术2010级1班', 
    members: 32, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=class1',
    lastActivity: '2分钟前',
    description: '我们的青春记忆',
    teacher: {
      name: '王老师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1',
      isOnline: true
    },
    confirmed: 24,
    pending: 5,
    declined: 3,
    students: Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      name: `同学${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`,
      isOnline: Math.random() > 0.7,
      hasMessage: Math.random() > 0.8
    })),
    photos: [
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=200&q=80',
      'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=200&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&q=80'
    ],
    messages: [
      { from: '张同学', time: '2天前', content: '还记得那次通宵准备比赛吗？虽然没拿奖，但那段时光真难忘...' },
      { from: '李同学', time: '1周前', content: '有人记得当年的食堂红烧肉吗？好怀念啊！' }
    ]
  },
  { 
    id: 2, 
    name: '外语系2010级', 
    members: 32, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=class2',
    lastActivity: '5分钟前',
    description: '语言连接世界',
    teacher: {
      name: '李老师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2',
      isOnline: false
    },
    confirmed: 18,
    pending: 8,
    declined: 6,
    students: Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      name: `同学${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=foreign${i}`,
      isOnline: Math.random() > 0.7,
      hasMessage: Math.random() > 0.8
    })),
    photos: [],
    messages: []
  },
  { 
    id: 3, 
    name: '数学系2009级', 
    members: 28, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=class3',
    lastActivity: '1小时前',
    description: '逻辑与美',
    teacher: {
      name: '陈老师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher3',
      isOnline: true
    },
    confirmed: 20,
    pending: 4,
    declined: 4,
    students: Array.from({ length: 28 }, (_, i) => ({
      id: i + 1,
      name: `同学${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=math${i}`,
      isOnline: Math.random() > 0.7,
      hasMessage: Math.random() > 0.8
    })),
    photos: [],
    messages: []
  },
])

const selectedClassroom = ref<Classroom | null>(null)
const selectedStudent = ref<Student | null>(null)
const showNoteModal = ref(false)
const noteContent = ref('')

function selectClassroom(classroom: Classroom) {
  selectedClassroom.value = classroom
}

function closeDetail() {
  selectedClassroom.value = null
  selectedStudent.value = null
}

function selectStudent(student: Student) {
  selectedStudent.value = student
}

function openNoteModal() {
  showNoteModal.value = true
  noteContent.value = ''
}

function closeNoteModal() {
  showNoteModal.value = false
  noteContent.value = ''
}

function sendNote() {
  if (noteContent.value.trim() && selectedClassroom.value) {
    selectedClassroom.value.messages.unshift({
      from: '我',
      time: '刚刚',
      content: noteContent.value
    })
    closeNoteModal()
  }
}

const daysUntilReunion = computed(() => {
  const targetDate = new Date('2024-06-01')
  const today = new Date()
  const diff = targetDate.getTime() - today.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})
</script>

<template>
  <div class="relative py-32 bg-slate-900/80 min-h-screen">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="font-serif-sc text-4xl md:text-5xl font-bold mb-4">
          班级<span class="gradient-text">密室</span>
        </h2>
        <p class="text-gray-400">专属空间，只属于你们班的数字教室</p>
      </div>

      <div v-if="!selectedClassroom" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="classroom in classrooms"
          :key="classroom.id"
          class="glass rounded-2xl p-6 hover-card cursor-pointer group"
          @click="selectClassroom(classroom)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-4">
              <img :src="classroom.avatar" class="w-16 h-16 rounded-full bg-slate-800" alt="">
              <div>
                <h3 class="font-bold text-lg">{{ classroom.name }}</h3>
                <p class="text-sm text-gray-400">{{ classroom.members }}位成员 · 最后活跃: {{ classroom.lastActivity }}</p>
              </div>
            </div>
          </div>
          
          <p class="text-gray-400 text-sm mb-4">{{ classroom.description }}</p>
          
          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <img 
                v-for="i in 3" 
                :key="i"
                :src="classroom.students[i-1]?.avatar" 
                class="w-8 h-8 rounded-full border-2 border-slate-800"
                alt=""
              >
              <div class="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-xs">
                +{{ classroom.members - 3 }}
              </div>
            </div>
            <button class="px-6 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 hover:bg-green-500/30 transition-all flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              进入教室
            </button>
          </div>
        </div>

        <div class="glass rounded-2xl p-6 border-2 border-dashed border-white/20 flex flex-col items-center justify-center min-h-[200px] hover:bg-white/10 transition-colors cursor-pointer">
          <div class="w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p class="text-gray-400">创建新班级</p>
        </div>
      </div>

      <div v-else class="space-y-8">
        <div class="flex justify-between items-center">
          <div>
            <button @click="closeDetail" class="text-gray-400 hover:text-white transition-colors mb-2 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              返回班级列表
            </button>
            <h3 class="text-2xl font-bold">{{ selectedClassroom.name }}</h3>
            <p class="text-gray-400 mt-1">{{ selectedClassroom.members }}位成员 · 最后活跃: {{ selectedClassroom.lastActivity }}</p>
          </div>
          <div class="flex gap-3">
            <span class="px-3 py-1 bg-slate-600 rounded text-sm">已确认: {{ selectedClassroom.confirmed }}人</span>
            <span class="px-3 py-1 bg-slate-600 rounded text-sm">待定: {{ selectedClassroom.pending }}人</span>
            <span class="px-3 py-1 bg-slate-600 rounded text-sm">无法参加: {{ selectedClassroom.declined }}人</span>
          </div>
        </div>

        <div class="glass rounded-3xl p-8">
          <div class="bg-slate-700 rounded-lg p-6 mb-8 text-center relative overflow-hidden">
            <div class="absolute top-2 right-2 text-xs text-gray-500">黑板报</div>
            <h4 class="text-xl font-serif-sc mb-2">🎉 毕业十周年聚会倒计时</h4>
            <p class="text-gray-300">距离2024年6月1日还有 {{ daysUntilReunion }} 天</p>
          </div>

          <div class="grid grid-cols-4 md:grid-cols-8 gap-4">
            <div
              v-for="student in selectedClassroom.students"
              :key="student.id"
              class="aspect-square rounded-lg border-2 relative cursor-pointer hover:scale-110 transition-transform group"
              :class="student.isOnline ? 'bg-blue-500/20 border-blue-400/50' : 'bg-slate-700/30 border-slate-600/30'"
              @click="selectStudent(student)"
            >
              <img 
                :src="student.avatar" 
                class="w-full h-full p-2 rounded-lg"
                :class="student.isOnline ? 'opacity-100' : 'opacity-50 grayscale'"
                alt=""
              >
              <div v-if="student.isOnline" class="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              <div v-if="student.hasMessage" class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <div class="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-center p-1">
                {{ student.name }}
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-center">
            <div class="glass px-8 py-4 rounded-xl text-center">
              <div class="text-sm text-gray-400 mb-1">辅导员</div>
              <div class="flex items-center gap-3">
                <img :src="selectedClassroom.teacher.avatar" class="w-10 h-10 rounded-full" alt="">
                <div class="text-left">
                  <div class="font-bold">{{ selectedClassroom.teacher.name }}</div>
                  <div class="text-xs" :class="selectedClassroom.teacher.isOnline ? 'text-green-400' : 'text-gray-500'">
                    {{ selectedClassroom.teacher.isOnline ? '在线' : '离线' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="glass rounded-2xl p-6 hover-card">
            <h4 class="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📸</span> 班级相册
            </h4>
            <div v-if="selectedClassroom.photos.length > 0" class="grid grid-cols-3 gap-2">
              <img 
                v-for="(photo, index) in selectedClassroom.photos.slice(0, 2)" 
                :key="index"
                :src="photo" 
                class="rounded-lg aspect-square object-cover hover:opacity-80 transition-opacity cursor-pointer"
              >
              <div class="rounded-lg bg-slate-800 flex items-center justify-center text-2xl cursor-pointer hover:bg-slate-700 transition-colors">
                +
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>暂无照片</p>
              <button class="mt-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors">
                上传第一张照片
              </button>
            </div>
          </div>

          <div class="glass rounded-2xl p-6 hover-card">
            <h4 class="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📝</span> 课桌抽屉 <span class="text-xs font-normal text-gray-500">(私密留言)</span>
            </h4>
            <div class="space-y-3">
              <div 
                v-for="(msg, index) in selectedClassroom.messages.slice(0, 3)" 
                :key="index"
                class="glass p-3 rounded-lg text-sm"
              >
                <div class="flex justify-between text-xs text-gray-500 mb-1">
                  <span>来自 {{ msg.from }}</span>
                  <span>{{ msg.time }}</span>
                </div>
                <p class="text-gray-300">{{ msg.content }}</p>
              </div>
              
              <div v-if="selectedClassroom.messages.length === 0" class="text-center py-4 text-gray-500">
                <p>暂无留言</p>
              </div>
              
              <button 
                @click="openNoteModal"
                class="w-full py-2 border border-dashed border-gray-600 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-300 transition-colors"
              >
                写一张纸条
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
      <div v-if="showNoteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="closeNoteModal" />
        
        <div class="relative glass rounded-3xl p-8 max-w-md w-full">
          <h3 class="text-2xl font-bold mb-6">写一张纸条</h3>
          
          <textarea
            v-model="noteContent"
            rows="4"
            class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 resize-none mb-4"
            placeholder="写下你想说的话..."
          />
          
          <div class="flex gap-3">
            <button 
              @click="sendNote"
              class="flex-1 btn-primary"
              :disabled="!noteContent.trim()"
            >
              发送
            </button>
            <button 
              @click="closeNoteModal"
              class="px-6 py-3 glass rounded-xl hover:bg-white/20 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.hover-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.hover-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
}
</style>
