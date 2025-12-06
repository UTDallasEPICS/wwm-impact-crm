<template>
    <div v-if="isPending" class="min-h-screen flex items-center justify-center">
      <p class="text-gray-600">Loading...</p>
    </div>
    <div v-else-if="!data?.session" class="min-h-screen flex items-center justify-center">
      <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <p class="text-gray-700 mb-4">Please log in to continue onboarding.</p>
        <button
          @click="navigateTo('/login')"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    </div>
    <div v-else class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-3xl font-bold mb-2">Welcome to Onboarding</h2>
          <p class="text-gray-600 mb-6">Please select which group you are a part of:</p>
          
          <!-- Search Bar -->
          <div class="mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search organizations by name..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Loading State -->
          <div v-if="organizationsPending" class="text-center py-8">
            <p class="text-gray-600">Loading organizations...</p>
          </div>
          
          <!-- Error State -->
          <div v-else-if="organizationsError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800">Error loading organizations: {{ organizationsError }}</p>
            <button
              @click="() => refreshOrganizations()"
              class="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
          
          <!-- Organizations List -->
          <div v-else-if="filteredOrganizations.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="organization in filteredOrganizations"
              :key="organization.id"
              @click="selectOrganization(organization)"
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all',
                selectedOrganization?.id === organization.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-lg text-gray-900">
                    {{ organization.name }}
                  </h3>
                </div>
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    selectedOrganization?.id === organization.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  ]"
                >
                  <svg
                    v-if="selectedOrganization?.id === organization.id"
                    class="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <p class="text-gray-600">
              {{ searchQuery ? 'No organizations found matching your search.' : 'No organizations available.' }}
            </p>
          </div>
          
          <!-- Selected Organization Info -->
          <div v-if="selectedOrganization" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <strong>Selected:</strong> {{ selectedOrganization.name }}
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div class="mt-6 flex gap-4">
            <button
              @click="handleSubmit"
              :disabled="!selectedOrganization || isSubmitting"
              :class="[
                'flex-1 px-6 py-3 rounded-lg font-semibold transition-all',
                selectedOrganization && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ isSubmitting ? 'Submitting...' : 'Continue' }}
            </button>
            <button
              @click="navigateTo('/')"
              class="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { authClient } from '../../auth-client'
  
  interface Organization {
    id: string
    name: string
  }
  
  // Auth state
  const session = authClient.useSession()
  const data = computed(() => session.value.data)
  const isPending = computed(() => session.value.isPending)
  
  // Organizations state
  const searchQuery = ref('')
  const selectedOrganization = ref<Organization | null>(null)
  const isSubmitting = ref(false)
  
  // Fetch organizations
  const { data: organizationsData, pending: organizationsPending, error: organizationsError, refresh: refreshOrganizations } = await useFetch<{ data: Organization[] }>('/api/organizations')
  
  // Filtered organizations based on search
  const filteredOrganizations = computed(() => {
    if (!organizationsData.value?.data) return []
    
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return organizationsData.value.data
    
    return organizationsData.value.data.filter((organization) => {
      const name = organization.name.toLowerCase()
      return name.includes(query)
    })
  })
  
  // Select organization
  const selectOrganization = (organization: Organization) => {
    selectedOrganization.value = organization
  }
  
  // Handle submit
  const handleSubmit = async () => {
    if (!selectedOrganization.value) return
    
    isSubmitting.value = true
    try {
      // TODO: Add API call to save user's organization selection
      // For now, just log and navigate
      console.log('Selected organization:', selectedOrganization.value)
      
      // You can add an API call here to save the selection
      // await $fetch('/api/users/select-organization', {
      //   method: 'POST',
      //   body: { organizationId: selectedOrganization.value.id }
      // })
      
      // Navigate to homepage after selection
      navigateTo('/')
    } catch (error) {
      console.error('Error submitting selection:', error)
      alert('There was an error saving your selection. Please try again.')
    } finally {
      isSubmitting.value = false
    }
  }
  </script>