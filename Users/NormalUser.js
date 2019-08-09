// var GeneralUser = require('./GeneralUser.js');
let inquirer = require('inquirer');
('Sign Up');
const fs = require('fs');
let displayMessage = require('../utils/displayMessage');

class NormalUser {
	constructor(email, password, userName) {
		this.email = email;
		this.password = password;
		this.userName = userName;
		this.movieCart = [];
		this.RentalCart = [];
	}
	menu() {
		console.clear();
		displayMessage('User Menu');
		console.log(`Hello ${this.userName}, nice to have you`);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'action',
					message: 'Select Any of the Following',
					choices: [ 'Add Movies To Rent Cart', 'Remove Movies', 'Checkout', 'logOut' ]
				}
			])
			.then((answers) => {
				let objRead;
				let data = fs.readFileSync('./Database/moviesDatabase.json', 'utf8');
				objRead = Object.values(JSON.parse(data));
				for (const user of objRead[0]) {
					this.movieCart.push(user.movieName);
				}
				if (answers.action == 'Add Movies To Rent Cart') {
					this.addMovieToRentCart('Add Movies');
				} else if (answers.action == 'Remove Movies') {
					this.removeMovieFromRentCart('Remove Movie From Rental Cart');
				} else if (answers.action == 'Checkout') {
					this.Checkout('Checkout');
				} else {
					this.logOut();
				}
			});
	}

	addMovieToRentCart() {
		console.clear();
		displayMessage('Add Movie to Cart');
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'movieSelected',
					message: 'Select Any of the Following',
					choices: this.movieCart
				}
			])
			.then((answers) => {
				let elmentAlreadyInCart;
				for (const movieInCart of this.RentalCart) {
					if (movieInCart === answers.movieSelected) {
						elmentAlreadyInCart = true;
					}
				}
				if (elmentAlreadyInCart === true) {
					console.clear();
					displayMessage(`${answers.movieSelected} is already in rental cart`);
				} else {
					this.RentalCart.push(answers.movieSelected);
					console.clear();
					displayMessage(`${answers.movieSelected} was Succcesfully added to rental Cart`);
				}
				console.log(this.RentalCart);
				inquirer
					.prompt([
						/* Pass your questions in here */
						{
							type: 'confirm',
							name: 'addMovie',
							message: 'Do you want to add another movie to rental cart?'
						}
					])
					.then((answers) => {
						if (answers.addMovie === true) {
							this.addMovieToRentCart();
						} else {
							this.menu();
						}
					});
			});
	}
	removeMovieFromRentCart() {
		console.clear();
		displayMessage('Remove Movies');
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'list',
					name: 'movieSelected',
					message: 'Select the movie you want to remove from Rental cart ',
					choices: this.RentalCart
				}
			])
			.then((answers) => {
				let movieselectedINdex = this.RentalCart.indexOf(answers.movieSelected);
				this.RentalCart.splice(movieselectedINdex, 1);
				console.clear();
				displayMessage(`${answers.movieSelected} was succcesfully removed rental Cart`);
				inquirer
					.prompt([
						/* Pass your questions in here */
						{
							type: 'confirm',
							name: 'removeMovie',
							message: 'Do you want to remove another movie to rental cart?'
						}
					])
					.then((answers) => {
						console.log(this.RentalCart);
						if (answers.removeMovie === true) {
							this.removeMovieFromRentCart();
						} else {
							this.menu();
						}
					});
			});
	}
	Checkout() {
		let cardRegex = /[0-9]/g;
		console.clear();
		displayMessage('check Out');
		console.log(this.RentalCart);
		let totalPrice = this.RentalCart.length * 100;
		console.log(`The rental price for each movie is #100 for each movie and your total fee is ${totalPrice} naira`);
		inquirer
			.prompt([
				/* Pass your questions in here */
				{
					type: 'confirm',
					name: 'contCheckout',
					message: 'Would you likre to proceed with checkout?'
				}
			])
			.then((answers) => {
				if (answers.contCheckout === true) {
					inquirer
						.prompt([
							/* Pass your questions in here */
							{
								type: 'input',
								name: 'cardDetails',
								message: 'Please Input your Credit Card Number, must be only numbers?',
								validate: function(value) {
									var pass = value.match(cardRegex);
									if (pass) {
										return true;
									} else {
										return 'Please enter a valid  Credit Card Number';
									}
								}
							}
						])
						.then((answers) => {
							displayMessage(`A total of ${totalPrice} naira was Succesful deducted from your account`);
							inquirer
								.prompt([
									/* Pass your questions in here */
									{
										type: 'confirm',
										name: 'removeMovie',
										message: 'Do you want to return to user Menu?'
									}
								])
								.then((answers) => {
									console.log(this.RentalCart);
									if (answers.removeMovie === true) {
										this.menu()
									} else {
										process.exit();
									}
								});
						});
				} else {
					this.menu();
				}
			});
	}
	// seeAllAvailableMovies(){

	// }
	logOut() {
        console.clear()
        displayMessage('Thanks for Using Our Services')
        process.exit()
    }
}

module.exports = NormalUser;
