<template>
  <div class="home">
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

    <input
      type="file"
      name="file"
      :disabled="state.matches('uploading')"
      @change="uploadFile($event.target.files)"
      accept="video/*"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />

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
  }
};
</script>

<style>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
