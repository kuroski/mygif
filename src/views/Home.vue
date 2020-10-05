<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="state.matches('upload.uploading')"
      class="w-full flex flex-col items-center rounded-lg p-6 bg-gray-100"
      key="uploading"
    >
      <div class="self-start w-full">
        <p class="text-lg mb-2">Uploading...</p>
        <div class="progress-line" />
      </div>
    </div>

    <div
      v-else-if="state.matches('upload.failure')"
      key="failure"
      class="w-full flex flex-col items-center rounded-lg p-6 bg-gray-100"
    >
      <div class="w-full flex flex-col items-center">
        <h2 class="text-center text-2xl">Failure!</h2>
        <p class="text-center mt-2 mb-6">Your upload failed, please</p>
        <button @click="send('RETRY')" class="btn">
          Try again
        </button>
      </div>
    </div>

    <div
      v-else-if="state.matches('upload.uploaded')"
      key="uploaded"
      class="w-full flex flex-col items-center rounded-lg p-6 bg-gray-100"
    >
      <div class="w-full">
        <h2 class="text-center text-2xl">Uploaded Successfully!</h2>
        <VLazyImage
          class="mx-auto my-6 rounded-lg border border-dashed w-full"
          :src="file.gif"
          :src-placeholder="file.thumbnail"
          :height="file.height"
          :style="{
            minHeight: '12rem'
          }"
        />
        <div class="border rounded py-1 px-2 w-full flex items-center">
          <input
            type="text"
            name="url"
            readonly
            :value="file.gif"
            class="appearance-none bg-transparent border-none flex-1 mr-2"
            ref="url"
          />
          <button @click="copyUrl" class="btn">
            {{ copyText }}
          </button>
        </div>

        <button @click="send('RESET')" class="btn btn--secondary mt-4">
          Upload new movie
        </button>
      </div>
    </div>

    <div
      v-else
      key="idle"
      class="w-full flex flex-col items-center rounded-lg p-6 bg-gray-100"
    >
      <div class="flex flex-col items-center">
        <label
          for="file"
          class="transition-all duration-500 ease-in-out flex w-full h-64 py-8 border-2 border-dashed border-blue-400 bg-blue-100 hover:border-blue-500 appearance-none rounded cursor-pointer focus:outline-none focus:shadow-outline"
          :class="{
            'bg-green-300': state.matches('drag.dragover'),
            'bg-gray-100':
              state.matches('drag.dragleave') || state.matches('drag.drop')
          }"
          @dragover.prevent="send('DRAGOVER')"
          @dragleave="send('DRAGLEAVE')"
          @drop.prevent="send('DROP', $event.dataTransfer.files)"
        >
          <img
            src="@/assets/upload.svg"
            alt="Drop your files here"
            class="transition-all duration-500 ease-in-out transform hover:scale-110"
          />
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

        <p class="text-center my-6 text-xl font-thin">or</p>

        <label for="file" class="btn">
          Choose a video
        </label>
      </div>
    </div>
  </transition>
</template>

<script>
import { useMachine } from "@xstate/vue";
import gifMachine from "@/gifMachine";
import { computed, ref } from "@vue/composition-api";

export default {
  name: "Home",
  setup(_context, { refs }) {
    const { state, send } = useMachine(gifMachine, { devTools: true });
    const copyText = ref("Copy link");
    return {
      state,
      send,
      copyText,
      file: computed(() => state.value.context.file),
      uploadFile: fileList => {
        if (!fileList.length) return;
        send("UPLOAD", fileList);
      },
      copyUrl: () => {
        refs.url.select();
        document.execCommand("copy");
        copyText.value = "Copied!";

        setTimeout(() => (copyText.value = "Copy link"), 2000);
      }
    };
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200 ease-in-out;
}

.fade-enter,
.fade-leave-to {
  @apply opacity-0;
}
</style>
