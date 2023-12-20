const { v4: generateId } = require('uuid');

const { NotFoundError } = require('../util/errors');
const { readData, writeData, readFavData, writeFavData } = require('./util');

async function getAll() {
  const storedData = await readData();
  if (!storedData.events) {
    throw new NotFoundError('Could not find any events.');
  }
  return storedData.events;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError('Could not find any events.');
  }

  const event = storedData.events.find((ev) => ev.id === id);
  if (!event) {
    throw new NotFoundError('Could not find event for id ' + id);
  }

  return event;
}

async function add(data) {
  const storedData = await readData();
  storedData.events.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}
async function addFav(data,userId) {
  const storedData = await readFavData();
  const isDuplicate = storedData.some((item) => {
    return (item.id === data.id && item.userId === userId)
});
  console.log(isDuplicate);
  if(!isDuplicate){
  storedData.unshift({ ...data,userId: userId });
  await writeFavData(storedData);
  return 1;
  }
  return 2;
}

async function getFav(userId) {
  const storedData = await readFavData();
  const event = storedData.filter((ev) => ev.userId === userId);
  return event;
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.events || storedData.events.length === 0) {
    throw new NotFoundError('Could not find any events.');
  }

  const index = storedData.events.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError('Could not find event for id ' + id);
  }

  storedData.events[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.events.filter((ev) => ev.id !== id);
  await writeData({ ...storedData, events: updatedData });
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
exports.addFav = addFav;
exports.getFav = getFav;
