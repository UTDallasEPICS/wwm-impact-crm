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
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-2" for="password"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your password"
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

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>
          Don't have an account?
          <NuxtLink to="/signup" class="text-blue-500 hover:text-blue-600"
            >Sign up here</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "../../auth-client";
import { UserRole } from "../../types/user";
import { useAuth } from "../../composables/useAuth";
import { useRouter } from "vue-router";

const email = ref("");
// const password = ref("");
//const auth = useAuth();

//const router = useRouter();
const handleLogin = async () => {
  const { data, error } = await authClient.signIn.magicLink({
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
