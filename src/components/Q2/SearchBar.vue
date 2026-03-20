<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['search'])
const searchInput = ref('')
let debounceTimer = null

watch(searchInput, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', val)
  }, 300)
})

function clearSearch() {
  searchInput.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        v-model="searchInput"
        type="text"
        placeholder="Search by name, email, city, age, birthdate..."
        class="search-input"
      />
      <button v-if="searchInput" class="clear-btn" @click="clearSearch">&times;</button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 500px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 40px;
  border-radius: var(--radius);
  font-size: 14px;
}

.clear-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  color: var(--text-secondary);
  padding: 4px 8px;
  line-height: 1;
}

.clear-btn:hover {
  color: var(--text);
}
</style>
