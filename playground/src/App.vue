<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
      <div class="h-full px-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Code2 class="w-8 h-8 text-primary-500" />
          <span class="text-xl font-semibold text-slate-800">Code Editor</span>
          <span class="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">Playground</span>
        </div>
        <div class="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank"
            class="p-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Github class="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>

    <div class="flex pt-16">
      <!-- Sidebar -->
      <aside class="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto">
        <nav class="p-4">
          <div class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Demos</div>
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.path">
              <router-link
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="[
                  $route.path === item.path 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                ]"
              >
                <component :is="getIcon(item.meta?.icon as string)" class="w-4 h-4" />
                {{ item.meta?.title }}
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
        <div class="p-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Code2, 
  Github,
  Home,
  Code,
  Palette,
  Languages,
  GitCompare,
  Zap,
  Lock,
  Puzzle,
  Wand2
} from 'lucide-vue-next'
import { navItems } from './router'

const iconMap: Record<string, unknown> = {
  Home,
  Code,
  Palette,
  Languages,
  GitCompare,
  Zap,
  Lock,
  Puzzle,
  Wand2
}

function getIcon(name: string) {
  return iconMap[name] || Code
}
</script>
