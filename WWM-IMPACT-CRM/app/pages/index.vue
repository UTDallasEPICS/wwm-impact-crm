<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Welcome</h1>

    <div v-if="!auth.user">
      <p>Please <NuxtLink to="/login">login</NuxtLink> to continue.</p>
    </div>

    <div v-else>
      <p class="mb-2">Logged in as: <strong>{{ auth.user.email }}</strong></p>
      <p class="mb-4">Role: <strong>{{ auth.user.role }}</strong></p>

      <div v-if="auth.isAdmin">
        <h2 class="text-xl font-semibold">Admin Panel</h2>
        <p>Full system access: manage users, view reports.</p>
      </div>

      <div v-else-if="auth.isOrgLeader">
        <h2 class="text-xl font-semibold">Organization Leader</h2>
        <p>Manage organization data and reports.</p>
      </div>

      <div v-else-if="auth.isDonor">
        <h2 class="text-xl font-semibold">Donor Portal</h2>
        <p>View donation history and profile.</p>
      </div>

      <div v-else>
        <h2 class="text-xl font-semibold">Basic User</h2>
        <p>View public information and your profile.</p>
      </div>

      <div class="mt-6">
        <button @click="auth.logout" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

const auth = useAuth()
</script>
