<script setup>
// 只渲染可視範圍內的列，避免 DOM 節點過多吃記憶體
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  rowHeight: { type: Number, default: 44 },
  bufferSize: { type: Number, default: 5 },
  sortField: { type: String, default: 'id' },
  sortOrder: { type: String, default: 'asc' }
})

const emit = defineEmits(['sort', 'edit', 'delete'])

const containerRef = ref(null)
const scrollTop = ref(0)
const containerHeight = ref(600)

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'birthdate', label: 'Birthdate', sortable: true },
  { key: 'city', label: 'City', sortable: true }
]

const totalHeight = computed(() => props.data.length * props.rowHeight)

const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.bufferSize)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(containerHeight.value / props.rowHeight)
  return Math.min(props.data.length, startIndex.value + visibleCount + props.bufferSize * 2)
})

const visibleData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value)
})

const offsetY = computed(() => startIndex.value * props.rowHeight)

function onScroll(e) {
  scrollTop.value = e.target.scrollTop
}

let resizeObserver = null

onMounted(() => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
    resizeObserver = new ResizeObserver(entries => {
      containerHeight.value = entries[0].contentRect.height
    })
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div class="virtual-table-wrapper">
    <div class="virtual-table-header">
      <table>
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="{ sortable: col.sortable, active: sortField === col.key }"
              @click="col.sortable && emit('sort', col.key)"
            >
              {{ col.label }}
              <span v-if="col.sortable" class="sort-icon">
                <template v-if="sortField === col.key">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </template>
                <template v-else>↕</template>
              </span>
            </th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
      </table>
    </div>
    <div
      ref="containerRef"
      class="virtual-scroll-container"
      @scroll="onScroll"
    >
      <div class="virtual-scroll-spacer" :style="{ height: totalHeight + 'px' }">
        <table :style="{ transform: `translateY(${offsetY}px)` }">
          <tbody>
            <tr
              v-for="row in visibleData"
              :key="row.id"
              :style="{ height: rowHeight + 'px' }"
            >
              <td>{{ row.id }}</td>
              <td>{{ row.firstName }}</td>
              <td>{{ row.lastName }}</td>
              <td class="email-col">{{ row.email }}</td>
              <td>{{ row.age }}</td>
              <td>{{ row.birthdate }}</td>
              <td>{{ row.city }}</td>
              <td class="actions-col">
                <div class="action-btns">
                  <button class="btn-outline btn-sm" @click="emit('edit', row)">Edit</button>
                  <button class="btn-danger btn-sm" @click="emit('delete', row.id)">Del</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="virtual-info">
      Showing {{ visibleData.length }} of {{ data.length }} rows
    </div>
  </div>
</template>

<style scoped>
.virtual-table-wrapper {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.virtual-table-header {
  overflow: hidden;
}

.virtual-table-header table {
  table-layout: fixed;
}

.virtual-scroll-container {
  height: 500px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.virtual-scroll-spacer {
  position: relative;
  overflow: hidden;
}

.virtual-scroll-spacer table {
  table-layout: fixed;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

th.sortable {
  cursor: pointer;
}

th.sortable:hover,
th.active {
  color: var(--primary);
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
}

.email-col {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions-col {
  width: 120px;
  text-align: center;
}

.action-btns {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.virtual-info {
  padding: 8px 12px;
  font-size: 12px;
  color: var(--success);
  border-top: 1px solid var(--border-light);
  text-align: center;
}
</style>
