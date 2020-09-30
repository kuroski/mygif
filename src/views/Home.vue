<template>
  <div class="shadow-outline rounded-lg p-6 bg-gray-200">
    <h1 class="text-center text-3xl">
      Video to Gif
    </h1>
    <p class="text-center my-2">File should be a video</p>

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
      class="shadow appearance-none border rounded w-full flex py-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      :class="{
        'bg-green-300': state.matches('drag.dragover'),
        'bg-gray-100':
          state.matches('drag.dragleave') || state.matches('drag.drop')
      }"
      @dragover.prevent="send('DRAGOVER')"
      @dragleave="send('DRAGLEAVE')"
      @drop.prevent="send('DROP', $event.dataTransfer.files)"
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
    const { state, send } = useMachine(gifMachine, { devTools: true });
    return {
      state,
      send,
      src: computed(
        () =>
          state.value.context.file?.gif ||
          "https://via.placeholder.com/468x60?text=Waiting+for+a+upload"
      ),
      uploadFile: fileList => {
        if (!fileList.length) return;
        send("UPLOAD", fileList);
      }
    };
  }
};
</script>
