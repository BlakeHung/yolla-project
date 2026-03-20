<script setup>
defineProps({
  data: { type: Array, required: true },
  sortField: { type: String, default: 'id' },
  sortOrder: { type: String, default: 'asc' },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['sort', 'edit', 'delete'])

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'firstName', label: 'First Name', sortable: true },
  { key: 'lastName', label: 'Last Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'birthdate', label: 'Birthdate', sortable: true },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'city', label: 'City', sortable: true }
]
</script>

<template>
  <div class="table-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
    <div class="table-scroll">
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
        <tbody>
          <tr v-if="data.length === 0">
            <td :colspan="columns.length + 1" class="empty-row">
              No records found.
            </td>
          </tr>
          <tr v-for="row in data" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.firstName }}</td>
            <td>{{ row.lastName }}</td>
            <td class="email-col">{{ row.email }}</td>
            <td>{{ row.age }}</td>
            <td>{{ row.birthdate }}</td>
            <td>{{ row.phone }}</td>
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
</template>

<style scoped>
.table-container {
  position: relative;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

th.sortable {
  cursor: pointer;
  white-space: nowrap;
}

th.sortable:hover {
  color: var(--primary);
}

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

.empty-row {
  text-align: center;
  color: var(--text-secondary);
  padding: 40px 12px;
}

@media (max-width: 768px) {
  table {
    font-size: 12px;
  }

  th, td {
    padding: 8px 6px;
  }

  .email-col {
    max-width: 120px;
  }
}
</style>
