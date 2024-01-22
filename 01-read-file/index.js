const fs = require('fs'); //подключили либу fs
const filePath = './01-read-file/text.txt'; //путь к файлу
const readStream = fs.createReadStream(filePath, 'utf8');
//создали поток при помощи функции fs.createReadStream

readStream.on('data', (chunk) => {
  // обратились к функции из библиотеки fs
  console.log(chunk);
});
