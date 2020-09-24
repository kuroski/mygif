import { assign, Machine, actions } from "xstate";

export default Machine({
  id: "gif",
  initial: "idle",
  context: {},
  states: {
    idle: {},
    uploading: {
      invoke: {
        id: "upload-file",
        src: context => {
          console.log(context);
          return new Promise(resolve => setTimeout(resolve, 1000));
        },
        onDone: {
          target: "uploaded",
          actions: actions.log(
            (context, event) =>
              `context: ${JSON.stringify(context)}, event: ${event.type}`,
            "Finish uploading"
          )
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
      target: ".uploading",
      actions: assign((_context, event) => {
        console.log(event);
        return {};
      })
    }
  }
});
