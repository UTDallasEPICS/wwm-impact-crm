<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Create Account</h2>

      <!-- Success message (commented out for now) -->
      <!-- <div
        v-if="successMessage"
        class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
      >
        {{ successMessage }}
      </div> -->

      <!-- Error message (commented out for now) -->
      <!-- <div
        v-if="errorMessage"
        class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
      >
        {{ errorMessage }}
      </div> -->

      <!-- Loading state (commented out for now) -->
      <!-- <div v-if="isLoading" class="text-center py-4">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-2 text-gray-600">Creating account...</p>
      </div> -->

      <!-- Signup form -->
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email"
            >Email Address</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email address"
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
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create a password"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Create Account
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>
          Already have an account?
          <NuxtLink to="/login" class="text-blue-500 hover:text-blue-600"
            >Sign in here</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";
// import { useRouter } from "vue-router";

// const email = ref("");
// const password = ref("");
// const isLoading = ref(false);
// const successMessage = ref("");
// const errorMessage = ref("");

// const router = useRouter();

const handleSignup = () => {
  // Functionality commented out for now - visual only
  console.log("Signup form submitted (no functionality)");

  // TODO: Add actual signup functionality later
  // if (!email.value || !password.value) return;
  // isLoading.value = true;
  // errorMessage.value = "";
  // successMessage.value = "";
  // ... rest of signup logic
};
</script>
