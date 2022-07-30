const express = require("express");
const axios = require("axios");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const FormData = require("form-data");
const fs = require("fs/promises");

const port = 8080;

const app = express();

app.get("/test", async (req, res) => {
  const image = await fs.readFile("./uploads/risk.docx");
  console.log(image);
  res.send("ok");
});

app.post("/profile", upload.single("avatar"), async function (req, res, next) {
  const file = req.file;
  const filePath = file.path.split("\\");
  const uploadedFile = await fs.readFile(file.path);
  const form = new FormData();
  form.append("file", uploadedFile, file.originalname);
  console.log("form", form);

  axios
    .post("http://localhost:8000/newprofile", form, {
      headers: {
        ...form.getHeaders(),
      },
    })
    .then((result) => {
      console.log("hahaha", result.data);
    })
    .catch((err) => console.log("error !!"));
  res.send("ok");
});

app.post(
  "/photos/upload",
  upload.array("photos", 12),
  function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  }
);

const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);
app.post("/cool-profile", cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});

app.listen(port, () => {
  console.log(`picasso server is running at port ${port}`);
});
