<template>
  <div v-if="isPending" class="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div v-if="!data?.session" class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your email"
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
    
    <div v-else>
      <p>You are already logged in as <strong>{{ data.user.email }}</strong>.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "../../auth-client";

const email = ref("");

// Better Auth session hook
const session = authClient.useSession();
const data = computed(() => session.value.data);
const isPending = computed(() => session.value.isPending);

const handleLogin = async () => {
  const { error } = await authClient.signIn.magicLink({
    email: email.value,
    callbackURL: "/",
  })

  if (error) {
    console.error("Magic link error: ", error)
    alert("There was an error sending your magic login link.")
    return
  }

  alert("A magic login link has been sent to your email! If it's not visible in your inbox, check your junk/spam folder.")
};

</script>
