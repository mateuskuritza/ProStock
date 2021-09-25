import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const localStorage = {
  storage: diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads/product-images');
    },
    filename: function (req, file, cb) {
      const fileName: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();

      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${fileName}${extension}`);
    },
  }),
};
