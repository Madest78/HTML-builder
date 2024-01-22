//библиотеки
const fs = require('fs');
const path = require('path');

const styleDirectoryPath = './06-build-page/styles';
const styleFileExtension = '.css';
const outputStyleFileName = './06-build-page/project-dist/style.css';

const htmlDirecoryPath = './06-build-page';
const htmlFileExtension = '.html';
const outputHtmlFileName = './06-build-page/project-dist/index.html';

const templateFilePath = './06-build-page/template.html';

const sourcePath = './06-build-page/assets';
const destinationPath = './06-build-page/project-dist/assets';

async function buildPage() {
  createFile(styleDirectoryPath, styleFileExtension, outputStyleFileName);
  createFile(htmlDirecoryPath, htmlFileExtension, outputHtmlFileName);
  replaceContent();
  copyDirectory(sourcePath, destinationPath);
}

//Функция создания файлов из задачи 5 слегка модифицированная принимает аргументы что бы создавать css и html файл
async function createFile(dirPath, fileType, outputFile) {
  //создадим директорию
  await fs.promises.mkdir(path.dirname(outputFile), {
    recursive: true,
  });
  //создаем поток записи в файл
  const outputStream = fs.createWriteStream(outputFile);
  try {
    //получаем список файлов из директории
    const files = await fs.promises.readdir(dirPath);
    for (const fileName of files) {
      //проверяем расширение файлов
      if (path.extname(fileName) === fileType) {
        const filePath = path.join(dirPath, fileName);
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

//функция перемещения контента в шаблон
async function replaceContent() {
  try {
    //читаем содержимое template.html
    let templateContent = await fs.promises.readFile(templateFilePath, 'utf-8');
    // находим {{...}} теги
    const tagRegex = /{{([^}]+)}}/g;
    const matches = templateContent.match(tagRegex);

    if (matches) {
      for (const match of matches) {
        const tagName = match.substring(2, match.length - 2); //извлекаем название тега
        const tagFilePath = path.join(
          './06-build-page/components',
          `${tagName}.html`,
        ); //путь к файлу с содержимым для тега
        try {
          const tagFileContent = await fs.promises.readFile(
            tagFilePath,
            'utf-8',
          );
          templateContent = templateContent.replace(match, tagFileContent);
        } catch (error) {
          console.error(`ERROR ${tagName}`, error);
        }
      }
    }
    await fs.promises.writeFile(outputHtmlFileName, templateContent);
  } catch (error) {
    console.error('ERROR;', error);
  }
}

//функция копирования директории из задачи 4 переделана в рекурсивную для работы с субдиректориями
function copyDirectory(src, dest) {
  //создаем директорию
  fs.mkdir(dest, { recursive: true }, () => {
    //читаем содержимое дериктории исходников рекурсивно в подпапках
    fs.readdir(src, (readDirErr, files) => {
      files.forEach((file) => {
        // создаем пути к исходникам и новым файлам
        const sourcePath = path.join(src, file);
        const destinationPath = path.join(dest, file);

        //получаем информацию о файле или директории
        fs.stat(sourcePath, (statErr, stats) => {
          //проверяем, директория или файл
          if (stats.isDirectory()) {
            //если директория вызываем рекурсивно copyDirectory
            copyDirectory(sourcePath, destinationPath);
          } else {
            //если файл, копируем в нокую директорию
            fs.copyFile(sourcePath, destinationPath, () => {});
          }
        });
      });
    });
  });
}

buildPage();
