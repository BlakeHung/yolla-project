<script setup>
import { ref, computed } from 'vue'
import { useUserDataStore } from '../../stores/userData'
import { useDataApi } from '../../composables/useDataApi'
import SearchBar from '../../components/Q2/SearchBar.vue'
import DataTable from '../../components/Q2/DataTable.vue'
import VirtualScrollTable from '../../components/Q2/VirtualScrollTable.vue'
import DataForm from '../../components/Q2/DataForm.vue'
import Pagination from '../../components/Q2/Pagination.vue'

const store = useUserDataStore()
const api = useDataApi()

const showForm = ref(false)
const editingRecord = ref(null)
const useVirtualScroll = ref(false)

const displayData = computed(() => {
  return useVirtualScroll.value ? store.filteredData : store.paginatedData
})

function onSearch(query) {
  store.setSearch(query)
}

function onSort(field) {
  store.setSort(field)
}

function onPageChange(page) {
  store.setPage(page)
}

function openAddForm() {
  editingRecord.value = null
  showForm.value = true
}

function openEditForm(record) {
  editingRecord.value = { ...record }
  showForm.value = true
}

async function handleFormSubmit(data) {
  if (editingRecord.value) {
    await api.updateUser(editingRecord.value.id, data)
  } else {
    await api.addUser(data)
  }
  showForm.value = false
  editingRecord.value = null
}

function handleFormCancel() {
  showForm.value = false
  editingRecord.value = null
}

async function handleDelete(id) {
  if (confirm('Are you sure you want to delete this record?')) {
    await api.deleteUser(id)
  }
}
</script>

<template>
  <div class="data-management">
    <div class="page-header">
      <div>
        <h1>Data Management</h1>
        <p class="subtitle">
          {{ store.totalFilteredRecords.toLocaleString() }} records
          <span class="server-note">(Server: {{ store.totalServerRecords.toLocaleString() }}+ total)</span>
        </p>
      </div>
      <div class="header-actions">
        <label class="toggle-label">
          <input type="checkbox" v-model="useVirtualScroll" />
          Virtual Scroll (RAM Optimized)
        </label>
        <button class="btn-primary" @click="openAddForm">+ Add Record</button>
      </div>
    </div>

    <div class="toolbar">
      <SearchBar @search="onSearch" />
      <div class="sort-info">
        Sort: <strong>{{ store.sortField }}</strong> ({{ store.sortOrder }})
      </div>
    </div>

    <!-- Standard Paginated Table -->
    <DataTable
      v-if="!useVirtualScroll"
      :data="store.paginatedData"
      :sort-field="store.sortField"
      :sort-order="store.sortOrder"
      :is-loading="store.isLoading"
      @sort="onSort"
      @edit="openEditForm"
      @delete="handleDelete"
    />

    <!-- Virtual Scroll Table (RAM optimized) -->
    <VirtualScrollTable
      v-else
      :data="store.filteredData"
      :sort-field="store.sortField"
      :sort-order="store.sortOrder"
      @sort="onSort"
      @edit="openEditForm"
      @delete="handleDelete"
    />

    <Pagination
      v-if="!useVirtualScroll"
      :current-page="store.currentPage"
      :total-pages="store.totalPages"
      :total-records="store.totalFilteredRecords"
      :page-size="store.pageSize"
      @page-change="onPageChange"
    />

    <DataForm
      :visible="showForm"
      :edit-data="editingRecord"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<style scoped>
.data-management {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.server-note {
  font-size: 12px;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
}

.toggle-label input[type="checkbox"] {
  accent-color: var(--primary);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.sort-info {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .page-header h1 {
    font-size: 20px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-info {
    text-align: center;
  }
}
</style>
