<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isQ3Admin = computed(() => route.path.startsWith('/q3/admin'))
</script>

<template>
  <div class="app-container">
    <nav class="top-nav">
      <div class="nav-brand">UWow Homework</div>
      <div class="nav-links">
        <router-link to="/q2/data">Q2 - Data Management</router-link>
        <router-link to="/q3/admin/dashboard">Q3 - Blog Admin</router-link>
      </div>
    </nav>

    <div class="main-layout" :class="{ 'with-sidebar': isQ3Admin }">
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-nav {
  background: #1a1a2e;
  color: #fff;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 32px;
  flex-shrink: 0;
}

.nav-brand {
  font-weight: 700;
  font-size: 18px;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.main-layout {
  flex: 1;
  display: flex;
}

.main-layout.with-sidebar .content {
  margin-left: 240px;
}

.content {
  flex: 1;
  padding: 24px;
  max-width: 100%;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .top-nav {
    padding: 0 12px;
    gap: 12px;
  }

  .nav-brand {
    font-size: 14px;
  }

  .nav-links a {
    font-size: 12px;
    padding: 6px 8px;
  }

  .main-layout.with-sidebar .content {
    margin-left: 0;
  }

  .content {
    padding: 16px;
  }
}
</style>
