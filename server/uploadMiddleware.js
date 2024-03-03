const multer = require("multer")

const eventIconStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Specify the destination directory for storing uploaded images
      cb(null, 'uploads/event-icons/');
    },
    filename: (req, file, cb) => {
      // Use a unique filename or keep the original filename
      const uniqueFilename = Date.now() + '-' + file.originalname;
      console.log(uniqueFilename)
      cb(null, uniqueFilename);
    },
  });

const eventImagesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/event-images/');
    },
    filename: (req, file, cb) => {
      const uniqueFilename = Date.now() + '-' + file.originalname;
      console.log(uniqueFilename)
      cb(null, uniqueFilename);
    },
});

const iconFileFilter = function (req, file, cb) {
  // Check if the file is an image
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
  
const uploadEventIcons = multer({ storage: eventIconStorage, fileFilter: iconFileFilter });
const uploadEventImages = multer({storage: eventImagesStorage});

module.exports = {uploadEventIcons, uploadEventImages}