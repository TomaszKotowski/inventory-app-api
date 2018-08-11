const fs = require('fs');
const helper = require('./helper');

const db = {};

db.offices = Array.from(Array(4), (x, i) => helper.createOffice(i));
db.places = Array.from(Array(10), (x, i) => helper.createPlace(i, db));
db.users = Array.from(Array(25), (x, i) => helper.createUser(i, db));
db.devices = Array.from(Array(60), (x, i) => helper.createDevice(i, db));


fs.writeFileSync('db.json', JSON.stringify(db));
