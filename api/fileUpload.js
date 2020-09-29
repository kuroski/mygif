const multiparty = require("multiparty");
const cloudinary = require("cloudinary").v2;

const allowCors = fn => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

module.exports = allowCors((req, res) => {
  const form = new multiparty.Form();
  form.parse(req, function(_err, _fields, files) {
    cloudinary.uploader
      .upload(files.movie[0].path, { resource_type: "video" })
      .then(function(image) {
        console.log();
        console.log("** File Upload (Promise)");
        console.log(
          "* public_id for the uploaded image is generated by Cloudinary's service."
        );
        console.log("* " + image.public_id);
        console.log("* " + image.url);
        res.json(image);
      })
      .catch(function(err) {
        console.log();
        console.log("** File Upload (Promise)");
        if (err) {
          console.warn(err);
        }
      });
  });
});
