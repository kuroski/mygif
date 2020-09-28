<template>
  <div class="home">
    <input
      type="file"
      name="file"
      :disabled="isSaving"
      @change="filesChange($event.target.name, $event.target.files)"
      accept="*"
      class="input-file"
    />
    <p v-if="isInitial">
      Drag your file(s) here to begin<br />
      or click to browse
    </p>
    <p v-if="isSaving">Uploadingfiles...</p>

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

    <img v-if="src" :src="src" />
  </div>
</template>

<script>
import { useMachine } from "@xstate/vue";
import gifMachine from "@/gifMachine";
import env from "@/env";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

function upload(formData, cb) {
  const url = `${env.API_URL}/fileUpload`;
  return (
    fetch(url, {
      method: "POST",
      body: formData
    })
      .then(x => x.json())
      // add url field
      .then(response => {
        cb(response.url.replace("mov", "gif"));
      })
  );
}

export default {
  name: "Home",
  setup() {
    const { state, send } = useMachine(gifMachine);
    return {
      state,
      send
    };
  },
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      src: null
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      upload(formData, url => {
        this.src = url;
      })
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      formData.append(fieldName, fileList[0], fileList[0].name);

      // save it
      this.save(formData);
    }
  },
  mounted() {
    this.reset();
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
