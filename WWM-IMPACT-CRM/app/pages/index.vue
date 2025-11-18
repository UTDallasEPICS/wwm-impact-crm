<template>
  
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Welcome</h1>
    
    <div v-if="isPending"><p>Loading...</p></div>

    <div v-else-if="!data">
      <p>Please <NuxtLink to="/login" class="text-blue-500 underline">log in</NuxtLink> to continue.</p>
    </div>

    <div v-else>
      <!--
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
      -->

      <!-- Bottom left section with logout button and user info side by side -->
      <div class="mt-6 flex items-center gap-4">
        <button
          @click="handleLogout"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>

        <div>
          <p class="mb-1">
            Logged in as: <strong>{{ data?.user.email }}</strong>
          </p>
          <p>
            Role: <strong>{{ "Placeholder" }}</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from "../../auth-client";
import { useRouter } from "vue-router";

// Vue router
const router = useRouter()

// Better Auth session hook
const { data, isPending } = authClient.useSession.get()

// Log out
const handleLogout = async () => {
  await authClient.signOut()
  await router.push("/login")
}

</script>
