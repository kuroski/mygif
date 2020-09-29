import { Machine, assign } from "xstate";
import env from "@/env";

function uploadMovie(_context, { formData }) {
  console.log(formData);
  return fetch(`${env.API_URL}/fileUpload`, {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => ({
      ...data,
      gif: data.url.replace("mov", "gif")
    }));
}

export default Machine({
  id: "gif",
  initial: "idle",
  context: {
    file: null
  },
  states: {
    idle: {},
    uploading: {
      invoke: {
        id: "upload-file",
        src: uploadMovie,
        onDone: {
          target: "uploaded",
          actions: assign((_context, { data }) => ({
            file: data
          }))
        },
        onError: "failure"
      }
    },
    uploaded: {
      on: {
        REFRESH: "uploading",
        RESET: "idle"
      }
    },
    failure: {
      on: {
        RETRY: "uploading",
        CANCEL: "idle"
      }
    }
  },
  on: {
    UPLOAD: {
      target: ".uploading"
    }
  }
});
