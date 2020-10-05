import { Machine, assign } from "xstate";
import env from "@/env";
import { raise } from "xstate/lib/actions";

function uploadMovie(context, fileList) {
  const file = fileList[0] || context.retryFile;
  const formData = new FormData();
  formData.append("movie", file, file?.name || "movie");

  return fetch(`${env.API_URL}/fileUpload`, {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => ({
      ...data,
      gif: data.url.replace("mov", "gif"),
      thumbnail: data.url.replace("mov", "jpeg")
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
        file: null,
        retryFile: null
      },
      states: {
        idle: {},
        uploading: {
          entry: assign((context, fileList) => ({
            file: null,
            retryFile: fileList[0] || context.retryFile
          })),
          invoke: {
            id: "upload-file",
            src: uploadMovie,
            onDone: {
              target: "uploaded",
              actions: assign((_context, { data }) => ({
                file: data,
                retryFile: null
              }))
            },
            onError: "failure"
          }
        },
        uploaded: {
          on: {
            REFRESH: "uploading",
            RESET: {
              target: "idle",
              actions: assign(() => ({
                retryFile: null
              }))
            }
          }
        },
        failure: {
          on: {
            RETRY: "uploading",
            CANCEL: {
              target: "idle",
              actions: assign(() => ({
                retryFile: null
              }))
            }
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
