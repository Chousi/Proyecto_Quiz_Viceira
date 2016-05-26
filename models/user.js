var crypto = require('crypto');

// Definición de la clase User:

module.exports = function(sequelize, Datatypes) {
	return sequelize.define('User',
	{ username: {
		type: Datatypes.STRING,
		unique: true,
		validate: {notEmpty: {msg: "Falta username" }}
	},
	password: {
		type: Datatypes.STRING,
		validate: {notEmpty: {msg: "Falta password"}},
		set: function (password) {
			//String aleatorio usado como salt.
			this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
			this.setDataValue('password', encryptPassword(password, this.salt));
		}
	},
	salt: {
		type: Datatypes.STRING
	},
	isAdmin: {
		type: Datatypes.BOOLEAN,
		defaultValue: false
	}
	},
	{ instanceMethods: {
		verifyPassword: function (password) {
			return encryptPassword(password, this.salt) === this.password;
		}
	}
	});
};

/*
 * Encripta un password en claro
 * Mezcla un password en claro con el salt proporcionado, ejecuta un SHA1 digest,
 * y devuelve 40 caracteres hexadecimales
 */
 function encryptPassword(password,salt) {
 	return crypto.createHmac('sha1', salt).update(password).digest('hex');
 }