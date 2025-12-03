<template>
  <!-- Loading State -->
  <div
    v-if="isPending"
    class="min-h-screen flex items-center justify-center bg-gray-50"
  >
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
      ></div>
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>

  <!-- Not Logged In -->
  <div
    v-else-if="!data?.session"
    class="min-h-screen flex items-center justify-center bg-gray-50"
  >
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Welcome</h2>
      <p class="text-gray-600 mb-6">Please log in to continue</p>
      <button
        @click="navigateTo('/login')"
        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Log In
      </button>
    </div>
  </div>

  <!-- Dashboard -->
  <div v-else class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>

          <div class="flex items-center gap-4">
            <!-- User Info -->
            <div class="text-right hidden sm:block">
              <p class="text-sm text-gray-600">{{ data?.user.email }}</p>
              <p class="text-xs text-gray-500">
                Role: <span class="font-medium">Placeholder</span>
              </p>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-2 text-gray-800">Welcome Back!</h2>
        <p class="text-gray-600">
          Here's what's happening with your account today.
        </p>
      </div>

      <!-- Role-Based Content (Currently Commented) -->
      <!--
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div v-if="auth.isAdmin">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Admin Panel</h2>
          <p class="text-gray-600">Full system access: manage users, view reports.</p>
        </div>

        <div v-else-if="auth.isOrgLeader">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Organization Leader</h2>
          <p class="text-gray-600">Manage organization data and reports.</p>
        </div>

        <div v-else-if="auth.isDonor">
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Donor Portal</h2>
          <p class="text-gray-600">View donation history and profile.</p>
        </div>

        <div v-else>
          <h2 class="text-xl font-semibold mb-2 text-gray-800">Basic User</h2>
          <p class="text-gray-600">View public information and your profile.</p>
        </div>
      </div>
      -->

      <!-- Upload CSV Section -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Upload Data</h3>
        <UploadCSV />
      </div>

      <!-- Session Debug Info (Development) -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">
          Session Information
        </h3>
        <div class="bg-gray-50 rounded p-4 overflow-x-auto">
          <details>
            <summary>Session Information (For Development)</summary>
            <pre>{{ session }}</pre>
          </details>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-gray-500 text-sm">
          © 2024 WWM Impact CRM. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import UploadCSV from "~/components/UploadCSV.vue";
import { authClient } from "../../auth-client";

// Better Auth session hook
const session = authClient.useSession();
const data = computed(() => session.value.data);
const isPending = computed(() => session.value.isPending);

// Log out
const handleLogout = async () => {
  await authClient.signOut();
  navigateTo("/login");
};
</script>
