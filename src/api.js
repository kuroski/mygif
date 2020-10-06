import env from "@/env";

export function uploadMovie(context, fileList) {
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
      gif: data.url.replace(/\.[0-9a-z]+$/i, ".gif"),
      thumbnail: data.url.replace(/\.[0-9a-z]+$/i, ".jpeg")
    }));
}
