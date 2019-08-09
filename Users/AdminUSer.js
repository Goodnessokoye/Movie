// var GeneralUser = require('./GeneralUser.js');
let inquirer = require('inquirer');
let displayMessage = require('../utils/displayMessage');
const fs = require('fs');

class AdminUser {
	constructor(email, password, userName) {
		this.email = email;
		this.password = password;
        this.userName = userName;
        this.movieName;
        this.movieCategory;
	}
	menu(message) {
		console.clear();
		displayMessage(message);
		console.log(`Hello ${this.userName}, nice to have you`);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'action',
					message: 'Please Select Any of the Following',
					choices: [
						'Add Movies',
						// 'Remove Movies',
						// 'See Available Movies',
						'Log Out'
					]
				}
			])
			.then((answers) => {
				if (answers.action == 'Add Movies') {
                    this.addMovies('Add Movies');
                }
				// else if (answers.action == 'Remove Movies') {
				// 	this.removeMovies('Remove Movies');
				// } else if (answers.action == 'See Available Movies') {
				// 	this.seeAvailableMovies();
                // } 
                else {
                    this.logOut('USer Succesfully Logged Out');
				}
			});
	}
	addMovies(message) {
		console.clear();
		displayMessage(message);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'input',
					name: 'movieName',
					message: 'Please Input Movie Name?'
				},
				{
					type: 'list',
					name: 'category',
					message: 'Please Select a movie Category',
					choices: [ 'Action', 'Comedy', 'Romance' ]
				}
			])
			.then((answers) => {
                var obj = {
                    movies: []
                };
				this.movieName = answers.movieName;
				this.movieCategory = answers.category;

				// write the new user to databse
				var json = JSON.stringify(obj);
				let self = this;
				fs.readFile('./Database/moviesDatabase.json', 'utf8', function readFileCallback(err, data) {
					if (err) {
						console.log(err);
					} else {
                        if(data){
                            obj = JSON.parse(data); //now it an object
                        }
                         //now it an object
						//add some data
						obj.movies.push({
							movieName: self.movieName,
							movieCategory: self.movieCategory,
			
						});
						json = JSON.stringify(obj); //convert it back to json
						fs.writeFile('./Database/moviesDatabase.json', json, 'utf8', function writrToFile(err, data) {
							if (err) {
								console.log(err);
							}
						});
					}
                });
                inquirer
                .prompt([
                    /* Pass your questions in here */
                    {
                        type: 'confirm',
                        name: 'addMovie',
                        message: 'Do you want to add another movie?',
                    }
                ])
                .then((answers) => {
                   if(answers.addMovie === true){
                    this.addMovies('Add Movies')
                   } else {
                       this.menu('Menu')
                   }
                });
			});
	}
	// removeMovies() {}
	// //see avialable movies - might call from the parent class
	// manageUserAccounts() {}
	logOut() {
        console.clear()
        displayMessage('Thanks for Using Our Services')
        process.exit()
    }
}

module.exports = AdminUser;
