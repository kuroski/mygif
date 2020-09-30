import { Machine, assign } from "xstate";
import env from "@/env";
import { raise } from "xstate/lib/actions";

function uploadMovie(_context, fileList) {
  const formData = new FormData();
  formData.append("movie", fileList[0], fileList[0].name);

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
  type: "parallel",
  states: {
    upload: {
      id: "upload",
      initial: "idle",
      context: {
        file: null
      },
      states: {
        idle: {},
        uploading: {
          entry: assign(() => ({
            file: null
          })),
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
      }
    },
    drag: {
      id: "drag",
      initial: "idle",
      states: {
        idle: {
          on: {
            DRAGOVER: "dragover"
          }
        },
        dragover: {
          on: {
            DRAGLEAVE: "dragleave",
            DROP: "drop"
          }
        },
        dragleave: {
          on: {
            DRAGOVER: "dragover",
            DROP: "idle"
          }
        },
        drop: {
          entry: raise("UPLOAD"),
          on: {
            DRAGLEAVE: "dragleave",
            DROP: "drop"
          }
        }
      }
    }
  },
  on: {
    UPLOAD: {
      target: ".upload.uploading"
    }
  }
});
