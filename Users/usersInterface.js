
let Admin = require('./AdminUSer')
let NormalUser = require('./NormalUser')
module.exports = function usersInterface(loggedInUser) {
	if (loggedInUser.isUserAdmin === true) {
		const admin = new Admin(loggedInUser.userEmail, loggedInUser.userPassword, loggedInUser.userName);
		admin.menu(`${loggedInUser.userName} Is Logged In`);
	} else {
		const normalUser = new NormalUser(loggedInUser.userEmail, loggedInUser.userPassword, loggedInUser.userName);
		normalUser.menu(`${loggedInUser.userName} Is Logged In`);
	}
};



