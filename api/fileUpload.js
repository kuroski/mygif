const fs = require("fs");
const multiparty = require("multiparty");
var ffmpeg = require("fluent-ffmpeg");

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
    ffmpeg(files.file[0].path)
      .on("end", function() {
        res.setHeader("Content-disposition", "attachment; filename=output.gif");
        const readStream = fs.createReadStream("./output.gif");
        readStream.on("open", function() {
          res.setHeader("Content-type", "image/gif");
          readStream.pipe(res);
        });
      })
      .save("./output.gif");
  });
});
