import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Two megabytes
const MAX_SIZE_FILE = 2 * 1024 * 1024;

const validMimeTypes = ['image/png', 'image/jpg'];
const validExtensions = ['.png', '.jpg'];

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
  limits: {
    fileSize: MAX_SIZE_FILE,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    console.log(file);
    const extension: string = path.extname(file.originalname);

    validMimeTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(
          new BadRequestException(
            'Invalid file mimeType, needs to be image/png or image/jpg',
          ),
        );

    validExtensions.includes(extension)
      ? cb(null, true)
      : cb(
          new BadRequestException('Invalid file type, needs to be PNG or JPG'),
        );
  },
};
