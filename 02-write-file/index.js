//подключаем библиотеки
const fs = require('fs');
const readline = require('node:readline');
const { stdin: input } = require('node:process');

console.log('Are You READY!!!');
//функция прощание+выход
function sayGoodByeAndExit() {
  console.log('Go home!');
  rl.close();
  writeStream.end();
  process.exit(0); //завершаем процесс
}

//создаем интерфейс ввода/вывода
const rl = readline.createInterface(input);

//создаем поток для записи в файл с флагом 'a'(добавление)
const writeStream = fs.createWriteStream('./02-write-file/02-write-file.txt', {
  flags: 'a',
});

//слушаем событие 'line', которое происходит при вводе
rl.on('line', (chunk) => {
  //проверяем, если строка === exit, завершаем программу.
  if (chunk.trim() === 'exit') {
    sayGoodByeAndExit();
  }
  //иначе записываем введенную строку с переносом строки
  writeStream.write(chunk + '\n');
});
//слушаем событие 'SIGINT'
process.on('SIGINT', sayGoodByeAndExit);
