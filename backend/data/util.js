const fs = require('node:fs/promises');

async function readData() {
  const data = await fs.readFile('events.json', 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  await fs.writeFile('events.json', JSON.stringify(data));
}
async function writeFavData(data) {
  await fs.writeFile('fav.json', JSON.stringify(data));
}
async function readFavData() {
  const data = await fs.readFile('fav.json', 'utf8');
  return JSON.parse(data);
}

exports.readData = readData;
exports.writeData = writeData;
exports.writeFavData = writeFavData;
exports.readFavData = readFavData;