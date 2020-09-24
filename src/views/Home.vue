<template>
  <div class="home">
    <div v-if="state.matches('idle')">
      idle
    </div>
    <div v-if="state.matches('uploading')">
      Uploading...
    </div>
    <div v-if="state.matches('uploaded')">
      uploaded
    </div>
    <div v-if="state.matches('failure')">
      failure
    </div>

    <button @click="send('UPLOAD', { data: 'MYBLOB' })">
      Send
    </button>
  </div>
</template>

<script>
import { useMachine } from "@xstate/vue";
import gifMachine from "@/gifMachine";

export default {
  name: "Home",
  setup() {
    const { state, send } = useMachine(gifMachine);
    return {
      state,
      send
    };
  }
};
</script>
