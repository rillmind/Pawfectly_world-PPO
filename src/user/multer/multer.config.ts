import { diskStorage, memoryStorage } from "multer";
import * as path from "path";

const date = Date.now();

export const multerConfig = {
  // storage: memoryStorage()
  storage: diskStorage({
    destination: "./uploads/profilePics/",
    filename: (req, file, cb) => {
      if (file) {
        const filename: string = path
          .parse(file.originalname)
          .name.replace(/\s/g, "");
        const extension: string = path.extname(file.originalname);
        cb(null, `${filename}${date}${extension}`);
      } else {
        cb(new Error("Erro ao processar o arquivo"), null);
      }
    },
  }),
};
