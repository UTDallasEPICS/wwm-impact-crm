<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full p-6 text-center">
      <h1 class="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
      <p class="text-gray-600 mb-6">
        You don't have permission to access this page.
      </p>
      <button
        @click="goHome"
        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Go Home
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const router = useRouter()
const goHome = () => {
  return router.push('/')
}
</script>
