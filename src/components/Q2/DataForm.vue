<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  editData: { type: Object, default: null },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref(getEmptyForm())

function getEmptyForm() {
  return {
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    birthdate: '',
    phone: '',
    city: ''
  }
}

watch(() => props.editData, (data) => {
  if (data) {
    form.value = { ...data }
  } else {
    form.value = getEmptyForm()
  }
}, { immediate: true })

function handleSubmit() {
  if (!form.value.firstName || !form.value.lastName) {
    alert('First Name and Last Name are required.')
    return
  }
  emit('submit', { ...form.value, age: Number(form.value.age) || 0 })
  form.value = getEmptyForm()
}

function handleCancel() {
  form.value = getEmptyForm()
  emit('cancel')
}
</script>

<template>
  <div v-if="visible" class="form-overlay" @click.self="handleCancel">
    <div class="form-modal card">
      <h3>{{ editData ? 'Edit Record' : 'Add New Record' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label>First Name *</label>
            <input v-model="form.firstName" type="text" required />
          </div>
          <div class="form-group">
            <label>Last Name *</label>
            <input v-model="form.lastName" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" />
          </div>
          <div class="form-group">
            <label>Age</label>
            <input v-model="form.age" type="number" min="0" max="200" />
          </div>
          <div class="form-group">
            <label>Birthdate</label>
            <input v-model="form.birthdate" type="date" />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input v-model="form.phone" type="text" />
          </div>
          <div class="form-group full-width">
            <label>City</label>
            <input v-model="form.city" type="text" />
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-outline" @click="handleCancel">Cancel</button>
          <button type="submit" class="btn-primary">
            {{ editData ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.form-modal {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-modal h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input {
  width: 100%;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
