const fs = require('fs');

const deleteFile = filePath =>
  new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

exports.deleteFile = deleteFile;
