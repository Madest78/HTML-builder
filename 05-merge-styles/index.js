//библиотеки
const fs = require('fs');
const path = require('path');

const directoryPath = './05-merge-styles/styles';
const fileExtension = '.css';
const outputFileName = './05-merge-styles/project-dist/bundle.css';

async function mergeStyles() {
  //создаем поток записи в файл
  const outputStream = fs.createWriteStream(outputFileName);
  try {
    //получаем список файлов из директории
    const files = await fs.promises.readdir(directoryPath);
    for (const fileName of files) {
      //проверяем расширение файлов
      if (path.extname(fileName) === fileExtension) {
        const filePath = path.join(directoryPath, fileName);
        //создаем поток чтения
        const inputStream = fs.createReadStream(filePath);
        //создаем промис который отработает когда завершится запись
        await new Promise((resolve, reject) => {
          inputStream.pipe(outputStream, { end: false }); //опция { end: false } не завершает запись после каждого файла
          inputStream.on('end', resolve);
          inputStream.on('error', reject);
        });
      }
    }
    outputStream.end();
  } catch (error) {
    console.error('ERROR:', error);
  }
}
mergeStyles();
