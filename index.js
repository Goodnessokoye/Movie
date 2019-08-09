var displayMessage = require('./utils/displayMessage');
var GeneralUser = require('./Users/GeneralUser');
// let  adminUser = require('./Admin');
// let normalUser = require('./User')
console.clear();

displayMessage('Welcome Chief')

const generalUser = new GeneralUser();
generalUser.menu();