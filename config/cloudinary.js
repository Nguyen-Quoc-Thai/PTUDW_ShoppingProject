var cloudinary = require("cloudinary").v2;

cloudinary.config({
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
});

module.exports.uploadSingleProduct = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader
      .upload(file, {
        folder: "products",
      })
      .then((result) => {
        if (result) {
          resolve({
            url: result.secure_url,
            id: result.public_id,
          });
        }
      });
  });
};

module.exports.uploadSingleAvatar = (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader
      .upload(file, {
        folder: "avatars",
      })
      .then((result) => {
        if (result) {
          resolve({
            url: result.secure_url,
            id: result.public_id,
          });
        }
      });
  });
};

module.exports.destroySingle = (id) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(id, (error, result) => {
      resolve(result);
    });
  });
};

module.exports.destroyMultiple = (IDs) => {
  return new Promise((resolve) => {
    cloudinary.api.delete_resources(IDs, (error, result) => {
      resolve(result);
    });
  });
};
