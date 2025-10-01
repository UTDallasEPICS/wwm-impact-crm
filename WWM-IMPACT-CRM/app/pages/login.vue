<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-2" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserRole } from '../../types/user'
import { useAuth } from '../../composables/useAuth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuth()

const router = useRouter()
const handleLogin = async () => {
  // Mock login: infer role from email (replace with real auth later)
  const mockUser = {
    id: '1',
    role: email.value.includes('admin') ? UserRole.ADMIN :
          email.value.includes('org') ? UserRole.ORGANIZATION_LEADER :
          email.value.includes('donor') ? UserRole.DONOR :
          UserRole.BASIC_USER,
    profile: {
      firstName: 'Test',
      lastName: 'User',
      email: email.value,
      dateJoined: new Date(),
      lastLogin: new Date()
    },
    permissions: {
      canManageDonations: email.value.includes('admin') || email.value.includes('org'),
      canViewReports: email.value.includes('admin') || email.value.includes('org'),
      canManageUsers: email.value.includes('admin'),
      canManageCampaigns: email.value.includes('admin') || email.value.includes('org'),
      canAccessAdminPanel: email.value.includes('admin')
    },
    status: 'active' as 'active' | 'inactive' | 'suspended',
    lastPasswordChange: new Date(),
    twoFactorEnabled: false
  }

  auth.setUser(mockUser)
  router.push('/')
}
</script>
