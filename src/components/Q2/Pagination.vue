<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalRecords: { type: Number, required: true },
  pageSize: { type: Number, required: true }
})

const emit = defineEmits(['page-change'])

const visiblePages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage
  const maxVisible = 5

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)

    if (current <= 3) {
      end = Math.min(4, total - 1)
    }
    if (current >= total - 2) {
      start = Math.max(total - 3, 2)
    }

    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }
  return pages
})

const startRecord = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const endRecord = computed(() => Math.min(props.currentPage * props.pageSize, props.totalRecords))
</script>

<template>
  <div class="pagination-wrapper">
    <div class="pagination-info">
      Showing {{ startRecord }}-{{ endRecord }} of {{ totalRecords.toLocaleString() }} records
    </div>
    <div class="pagination-controls">
      <button
        class="btn-outline btn-sm"
        :disabled="currentPage === 1"
        @click="emit('page-change', currentPage - 1)"
      >
        Prev
      </button>
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="dots">...</span>
        <button
          v-else
          class="btn-sm"
          :class="page === currentPage ? 'btn-primary' : 'btn-outline'"
          @click="emit('page-change', page)"
        >
          {{ page }}
        </button>
      </template>
      <button
        class="btn-outline btn-sm"
        :disabled="currentPage === totalPages"
        @click="emit('page-change', currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.pagination-info {
  font-size: 13px;
  color: var(--text-secondary);
}

.pagination-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.dots {
  padding: 4px 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

@media (max-width: 600px) {
  .pagination-wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }

  .pagination-info {
    text-align: center;
  }
}
</style>
