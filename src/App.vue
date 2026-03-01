<script setup lang="ts">
import ParticleBackground from '@/components/features/ParticleBackground.vue'
import Navigation from '@/components/layout/Navigation.vue'
import ChatWidget from '@/components/features/ChatWidget.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden">
    <ParticleBackground />
    <Navigation />
    
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <ChatWidget />
    <ThemeToggle />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
