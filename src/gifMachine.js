import { Machine, assign } from "xstate";
import { uploadMovie } from "@/api";
import { raise } from "xstate/lib/actions";

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
