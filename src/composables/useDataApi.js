/**
 * Q2 - Vue3 APIs for: Add, Delete, Update, Search, Sort and Ordering
 *
 * This composable simulates RESTful API calls that would interact with a backend.
 * In production, these would make HTTP requests to a real server.
 *
 * API Design (RESTful):
 *   GET    /api/users?page=1&pageSize=500&search=keyword&sortBy=age&order=asc
 *   POST   /api/users          (Add)
 *   PUT    /api/users/:id      (Update)
 *   DELETE /api/users/:id      (Delete)
 *
 * For 10M+ rows:
 *   - All search/sort/pagination is handled server-side
 *   - Backend uses database indexes on sortable fields (age, birthdate, etc.)
 *   - API returns paginated results with total count for pagination UI
 */

import { useUserDataStore } from '../stores/userData'

// Simulate network delay
function delay(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useDataApi() {
  const store = useUserDataStore()

  /**
   * GET /api/users - Fetch paginated, filtered, sorted data
   * In production: sends query params to backend for server-side processing
   *
   * @param {Object} params
   * @param {number} params.page - Current page number
   * @param {number} params.pageSize - Items per page (default 500)
   * @param {string} params.search - Search keyword
   * @param {string} params.sortBy - Field to sort by
   * @param {string} params.order - Sort order ('asc' | 'desc')
   * @returns {Promise<{data: Array, total: number, page: number, pageSize: number}>}
   */
  async function fetchUsers({ page = 1, pageSize = 500, search = '', sortBy = 'id', order = 'asc' } = {}) {
    store.isLoading = true
    try {
      await delay(300)

      // In production, this would be:
      // const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}&search=${search}&sortBy=${sortBy}&order=${order}`)
      // return await res.json()

      store.setSearch(search)
      store.sortField = sortBy
      store.sortOrder = order
      store.setPage(page)
      store.pageSize = pageSize

      return {
        data: store.paginatedData,
        total: store.totalFilteredRecords,
        page: store.currentPage,
        pageSize: store.pageSize
      }
    } finally {
      store.isLoading = false
    }
  }

  /**
   * POST /api/users - Add a new record
   * In production: sends POST request with JSON body
   *
   * @param {Object} userData - The user data to add
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async function addUser(userData) {
    store.isLoading = true
    try {
      await delay(200)

      // In production:
      // const res = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      // return await res.json()

      // Validate required fields
      if (!userData.firstName || !userData.lastName) {
        throw new Error('firstName and lastName are required')
      }

      store.addRecord(userData)
      return { success: true, data: userData }
    } finally {
      store.isLoading = false
    }
  }

  /**
   * PUT /api/users/:id - Update an existing record
   * In production: sends PUT request with JSON body
   *
   * @param {number} id - The record ID to update
   * @param {Object} updates - The fields to update
   * @returns {Promise<{success: boolean, data: Object}>}
   */
  async function updateUser(id, updates) {
    store.isLoading = true
    try {
      await delay(200)

      // In production:
      // const res = await fetch(`/api/users/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // })
      // return await res.json()

      store.updateRecord(id, updates)
      return { success: true, data: { id, ...updates } }
    } finally {
      store.isLoading = false
    }
  }

  /**
   * DELETE /api/users/:id - Delete a record
   * In production: sends DELETE request
   *
   * @param {number} id - The record ID to delete
   * @returns {Promise<{success: boolean}>}
   */
  async function deleteUser(id) {
    store.isLoading = true
    try {
      await delay(200)

      // In production:
      // const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      // return await res.json()

      store.deleteRecord(id)
      return { success: true }
    } finally {
      store.isLoading = false
    }
  }

  /**
   * GET /api/users/search - Search with server-side full-text search
   * In production: leverages database full-text search or Elasticsearch
   *
   * @param {string} query - Search query string
   * @param {Object} options - Additional options (sortBy, order, page, pageSize)
   * @returns {Promise<{data: Array, total: number}>}
   */
  async function searchUsers(query, options = {}) {
    return fetchUsers({ ...options, search: query })
  }

  /**
   * GET /api/users?sortBy=field&order=asc|desc - Sort data
   * In production: uses database ORDER BY with indexes
   *
   * @param {string} field - Field to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {Promise<{data: Array, total: number}>}
   */
  async function sortUsers(field, order = 'asc') {
    return fetchUsers({
      sortBy: field,
      order,
      page: 1,
      search: store.searchQuery
    })
  }

  return {
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    searchUsers,
    sortUsers
  }
}
