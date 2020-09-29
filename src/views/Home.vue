<template>
  <div class="shadow-outline rounded-lg p-6 bg-gray-200">
    <h1 class="text-center text-3xl">
      Video to Gif
    </h1>
    <p class="text-center my-2">File should be a video</p>

    <div class="text-3xl font-bold mb-3">
      <div v-if="state.matches('idle')">
        idle
      </div>
      <div v-if="state.matches('uploading')" class="text-blue-500">
        Uploading...
      </div>
      <div v-if="state.matches('uploaded')" class="text-green-500">
        uploaded
      </div>
      <div v-if="state.matches('failure')" class="text-red-500">
        failure
      </div>
    </div>

    <label
      for="file"
      class="shadow appearance-none border rounded w-full flex py-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <input
        id="file"
        type="file"
        name="file"
        :disabled="state.matches('uploading')"
        @change="uploadFile($event.target.files)"
        accept="video/*"
        class="w-px h-px opacity-0 overflow-hidden absolute"
      />
    </label>

    <img :src="src" class="mx-auto mt-6" />
  </div>
</template>

<script>
import { useMachine } from "@xstate/vue";
import gifMachine from "@/gifMachine";
import { computed } from "@vue/composition-api";

export default {
  name: "Home",
  setup() {
    const { state, send } = useMachine(gifMachine);
    return {
      state,
      send,
      src: computed(
        () =>
          state.value.context.file?.gif ||
          "https://via.placeholder.com/468x60?text=Waiting+for+a+upload"
      ),
      uploadFile: fileList => {
        const formData = new FormData();
        if (!fileList.length) return;
        formData.append("movie", fileList[0], fileList[0].name);
        console.log(formData, fileList);
        send("UPLOAD", { formData });
      }
    };
  },
  methods: {
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains("bg-green-300")) {
        event.currentTarget.classList.remove("bg-gray-100");
        event.currentTarget.classList.add("bg-green-300");
      }
    },
    dragleave(event) {
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    },
    drop(event) {
      event.preventDefault();
      this.uploadFile(event.dataTransfer.files); // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add("bg-gray-100");
      event.currentTarget.classList.remove("bg-green-300");
    }
  }
};
</script>
