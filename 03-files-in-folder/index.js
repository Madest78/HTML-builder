//библиотеки
const path = require('path');
const fs = require('fs/promises');

async function readSecretDirectory() {
  //читаем файлы из каталога
  try {
    const filesInfo = await fs.readdir('./03-files-in-folder/secret-folder', {
      withFileTypes: true,
    });
    for (const fileInfo of filesInfo) {
      const filePath = `./03-files-in-folder/secret-folder/${fileInfo.name}`; //формируем пути к файлам с именами
      const filePathParsed = path.parse(filePath); //парсим путь
      const fileName = filePathParsed.name; //извлекаем только имя
      const fileExtension = path.extname(filePath); //читаем расширение файла
      const stats = await fs.stat(filePath); //получаем статистику обьекта
      const isFile = fileInfo.isFile(); //проверка типа обьекта
      if (isFile) {
        console.log(
          `${fileName} - ${fileExtension.substring(1)} - ${stats.size}B`,
        );
      }
    }
  } catch (error) {
    console.error('Error reading the dirrectory:', error);
  }
}
readSecretDirectory();
