const faker = require('faker');

const citiesMock = [
  'Białystok',
  'Warszawa',
  'Wrocław',
  'Szczecin',
  'Olsztyn'
];
const createOffice = (id) => {
  return {
    id: faker.random.uuid(),
    name: id < citiesMock.length ? citiesMock[id] : faker.address.city(),
  };
};

const createUser = (id, db) => {
  return {
    id: faker.random.uuid(),
    avatar: faker.image.avatar(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    login: 'user' + id,
    officeId: (faker.random.arrayElement(db.offices) || {}).id,
    isAdmin: id % 2 === 0,
  };
};

const devicesMock = [
  'Xiaomi Redmi Note 5',
  'Samsung Galaxy S7 G930F',
  'Motorola Moto G5 FHD',
  'Apple iPhone 8 64GB',
  'Apple iPhone 6s 32GB',
  'Apple MacBook Pro i7/16GB',
  'Apple MacBook Air i7/8GB',
  'Apple Macbook 12" i5',
  'Dell Inspiron 5770 i5-8250U'
];
const createDevice = (id, db) => {
  const user = (faker.random.arrayElement(db.users) || {});
  const place = (faker.random.arrayElement(db.places) || {});
  const deviceId = faker.random.uuid();
  return {
    // id,
    id: deviceId,
    name: faker.random.arrayElement(devicesMock),
    belongsToId: faker.random.arrayElement([user, place]).id,
    imageUrl: 'https://placeimg.com/400/400/tech?id=' + deviceId,
    description: faker.lorem.sentence()
  }
};

const placesMock = [
  'Mordor',
  'Rivendell',
  'Shire',
];
const createPlace = (id, db) => {
  return {
    id: faker.random.uuid(),
    name: id < placesMock.length ? placesMock[id] : faker.address.city(),
    officeId:  (faker.random.arrayElement(db.offices) || {}).id,
  };
};

module.exports = {
  createOffice,
  createUser,
  createDevice,
  createPlace,
};
