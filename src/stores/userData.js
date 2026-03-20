import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Generate mock data simulating 10M+ rows (we generate a subset for demo)
function generateMockData(count = 2000) {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']

  const data = []
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const birthYear = 1950 + Math.floor(Math.random() * 60)
    const birthMonth = 1 + Math.floor(Math.random() * 12)
    const birthDay = 1 + Math.floor(Math.random() * 28)
    const birthdate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`
    const age = new Date().getFullYear() - birthYear

    data.push({
      id: i,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      age,
      birthdate,
      phone: `+1-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'][Math.floor(Math.random() * 10)]
    })
  }
  return data
}

export const useUserDataStore = defineStore('userData', () => {
  const allData = ref(generateMockData(2000))
  const searchQuery = ref('')
  const sortField = ref('id')
  const sortOrder = ref('asc') // 'asc' | 'desc'
  const currentPage = ref(1)
  const pageSize = ref(500)
  const isLoading = ref(false)

  // Simulated total count (pretend we have 10M+ rows in backend)
  const totalServerRecords = ref(10000000)

  const filteredData = computed(() => {
    let result = [...allData.value]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(item =>
        item.firstName.toLowerCase().includes(query) ||
        item.lastName.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query) ||
        String(item.age).includes(query) ||
        item.birthdate.includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField.value]
      let valB = b[sortField.value]

      if (typeof valA === 'string') {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })

    return result
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredData.value.slice(start, start + pageSize.value)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredData.value.length / pageSize.value)
  })

  const totalFilteredRecords = computed(() => filteredData.value.length)

  function setSort(field) {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
    currentPage.value = 1
  }

  function setSearch(query) {
    searchQuery.value = query
    currentPage.value = 1
  }

  function setPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function addRecord(record) {
    const maxId = allData.value.reduce((max, item) => Math.max(max, item.id), 0)
    allData.value.push({ ...record, id: maxId + 1 })
  }

  function updateRecord(id, updates) {
    const index = allData.value.findIndex(item => item.id === id)
    if (index !== -1) {
      allData.value[index] = { ...allData.value[index], ...updates }
    }
  }

  function deleteRecord(id) {
    allData.value = allData.value.filter(item => item.id !== id)
  }

  return {
    allData,
    searchQuery,
    sortField,
    sortOrder,
    currentPage,
    pageSize,
    isLoading,
    totalServerRecords,
    filteredData,
    paginatedData,
    totalPages,
    totalFilteredRecords,
    setSort,
    setSearch,
    setPage,
    addRecord,
    updateRecord,
    deleteRecord
  }
})
