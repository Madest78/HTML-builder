//библиотеки
const fs = require('fs');
const path = require('path');

const sourceDir = './04-copy-directory/files';
const destinationDir = './04-copy-directory/files-copy';

fs.mkdir(destinationDir, { recursive: true }, () => {
  //создаем новую директорию
  fs.readdir(sourceDir, (readdirErr, files) => {
    if (readdirErr) {
      console.error('ERROR READING', readdirErr);
      return;
    }
    //получаем содержимое директории
    files.forEach((file) => {
      //копируем каждый файл в новую директорю
      //копируем пути для исходного и нового файлов
      const sourcePath = path.join(sourceDir, file);
      const destinationPath = path.join(destinationDir, file);
      fs.copyFile(sourcePath, destinationPath, () => {});
    });
  });
});
