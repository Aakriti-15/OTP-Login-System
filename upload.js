const multer = require ('multer');
const path = require('path');

const fileFilter= (req, file, cb)=>{
    if (!file || !file.originalname) {
    return cb(new Error('No file provided'), false);
  }

    const ext = path.extname(file.originalname).toLowerCase();
    if(ext === '.xlsx' || ext == '.xls'){
        cb(null, true);
    }else{
        cb(new Error('Only excel files are allowed'), false);
    }
};

const storage = multer.memoryStorage();
const upload= multer({storage , fileFilter});

module.exports = upload;