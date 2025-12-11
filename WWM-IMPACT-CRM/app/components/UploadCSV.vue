<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Upload CSV for Data Ingestion</h2>
    <form @submit.prevent="handleUpload" enctype="multipart/form-data" class="space-y-4">
      <input
        type="file"
        multiple
        accept=".csv,.xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        @change="onFileChange"
        class="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        type="submit"
        :disabled="uploading"
        class="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ uploading ? "Uploading..." : "Upload and Process" }}
      </button>
    </form>
    <p
      v-if="message"
      class="mt-4 text-center"
      :class="{ 'text-green-600': !error, 'text-red-600': error }"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const files = ref([]);
const uploading = ref(false);
const message = ref("");
const error = ref(false);

const onFileChange = (e) => {
  files.value = Array.from(e.target.files);
};

const handleUpload = async () => {
  if (files.value.length === 0) return;
  uploading.value = true;
  const formData = new FormData();
  files.value.forEach((file) => formData.append("files", file));

  try {
    const res = await fetch("/api/ingest/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    message.value = `Success: ${data.processed} records processed`;
    error.value = false;
  } catch (err) {
    message.value = err.message || "Upload failed";
    error.value = true;
  } finally {
    uploading.value = false;
  }
};

</script>
