<template>
  <div
    class="flex flex-col items-center shadow-outline rounded-lg p-6 bg-gray-200"
  >
    <div class="text-3xl font-bold mb-3">
      <div v-if="state.matches('upload.idle')">
        idle
      </div>
      <div v-if="state.matches('upload.uploading')" class="text-blue-500">
        Uploading...
      </div>
      <div v-if="state.matches('upload.uploaded')" class="text-green-500">
        uploaded
      </div>
      <div v-if="state.matches('upload.failure')" class="text-red-500">
        failure
      </div>
    </div>

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

    <p class="text-center my-8 text-xl font-thin">or</p>

    <label
      for="file"
      class="transition ease-in-out duration-300 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
    >
      Choose a video
    </label>

    <img v-if="src" :src="src" class="mx-auto mt-6" />
  </div>
</template>

<script>
import { useMachine } from "@xstate/vue";
import gifMachine from "@/gifMachine";
import { computed } from "@vue/composition-api";

export default {
  name: "Home",
  setup() {
    const { state, send } = useMachine(gifMachine, { devTools: true });
    return {
      state,
      send,
      src: computed(() => state.value.context.file?.gif || null),
      uploadFile: fileList => {
        if (!fileList.length) return;
        send("UPLOAD", fileList);
      }
    };
  }
};
</script>
