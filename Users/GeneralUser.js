let inquirer = require('inquirer');
const fs = require('fs');
let displayMessage = require('../utils/displayMessage');
let usersInteface = require('./usersInterface')


let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
let userNameRegex = /^[a-z][a-z0-9]+$/i
class GeneralUser {
	constructor() {
		this.userName, this.admin, this.email, this.password, this.phoneNumber;
	}
	menu() {
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'action',
					message: 'Please Select Any of the Following',
					choices: [ 'Login', 'Signup' ]
				}
			])
			.then((answers) => {
				if (answers.action == 'Login') {
					this.login('Login');
				} else {
					this.signup('Sign Up');
				} 
			});
	}

	login(message) {
		console.clear();
		displayMessage(message);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'input',
					name: 'email',
					message: 'Please Input your email address?',
					validate: function(value) {
						var pass = value.match(emailRegex);
						if (pass) {
							return true;
						} else {
							return 'Please enter a valid email address';
						}
					}
				},
				{
					type: 'password',
					name: 'password',
					message: 'Please Input your password?',
					mask: true
				}
			])
			.then((answers) => {
				//confirms the use name and password macth
				let passLogin, objRead, loggedInUser;
				let data = fs.readFileSync('./Database/UserDatabase.json', 'utf8');
				objRead = Object.values(JSON.parse(data));
				for (const user of objRead[0]) {
					if (user.userEmail === answers.email && user.userPassword === answers.password) {
						passLogin = true;
						loggedInUser = user;
					}
				}
				//instantiat the person as a normal user or admin, if its an admin
				if (passLogin == true) {
					console.log('I am logged in');
					usersInteface(loggedInUser)
				} else {
					this.login('Incorrect email or password');
				}
			});
	}

	signup(message) {
		console.clear();
		displayMessage(message);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'input',
					name: 'userName',
					message: 'Please Input your username?',
					validate: function(value) {
						var pass = value.match(userNameRegex);
						if (pass) {
							return true;
						} else {
							return 'Please enter a valid Username, combination of only letters and numbers and must start with a letter';
						}
					}
				},
				{
					type: 'input',
					name: 'email',
					message: 'Please Input a valid email address?',
					validate: function(value) {
						var pass = value.match(emailRegex);
						if (pass) {
							return true;
						} else {
							return 'Please enter a valid email address';
						}
					}
				},
				{
					type: 'password',
					name: 'password',
					message: 'Please Input your password?',
					mask: true
				},
				{
					type: 'input',
					name: 'phone',
					message: 'Please Input your phone number(+234)?',
					validate: function(value) {
						var pass = value.match(/^\d{10}$/i);
						if (pass) {
							return true;
						} else {
							return 'Please enter a valid phone number(+234)';
						}
					}
				},
				{
					type: 'confirm',
					name: 'userType',
					message: 'Is this an adminstrative account?'
					//if yes please input adminstrative secret key
				}
			])
			.then((answers) => {
				let passSignUp, objRead;
				let data = fs.readFileSync('./Database/UserDatabase.json', 'utf8');
				objRead = Object.values(JSON.parse(data));
				for (const user of objRead[0]) {
					if (user.userEmail === answers.email) {
						passSignUp = false;
					}
				}
				if (passSignUp == false) {
					this.signup('A user already has this email address, please use another email');
				} else {
					var obj = {
						table: []
					};
					this.userName = answers.userName;
					this.admin = answers.userType;
					this.email = answers.email;
					this.password = answers.password;
					this.phoneNumber = '+234' + answers.phone;

					// write the new user to databse
					var json = JSON.stringify(obj);
					let self = this;
					fs.readFile('./Database/UserDatabase.json', 'utf8', function readFileCallback(err, data) {
						if (err) {
							console.log(err);
						} else {
							if(data){
								obj = JSON.parse(data); //now it an object
							}
							
							//add some data
							obj.table.push({
								isUserAdmin: self.admin,
								userName: self.userName,
								userEmail: self.email,
								userPassword: self.password,
								userPhoneNum: self.phoneNumber
							});
							json = JSON.stringify(obj); //convert it back to json
							fs.writeFile('./Database/UserDatabase.json', json, 'utf8', function writrToFile(err, data) {
								if (err) {
									console.log(err);
								}
							});
						}
					});
					console.clear();
					displayMessage('User Succesfully Created');
					this.menu();
				}
			});
	}
	// seeAvailableMovies() {}
}

module.exports = GeneralUser;
