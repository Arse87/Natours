const multer = require("multer");
const AppError = require("./appError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(`Solo immagini`, 400), false);
  }
};

module.exports = multer({ storage, fileFilter });
