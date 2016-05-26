// Definicion del modelo Comments:
module.exports = function(sequelize, Datatypes) {
	return sequelize.define('Comment',
							{ text: { type: Datatypes.STRING,
							  		  validate: { notEmpty: {msg: "Falta Comentario"}}
							  		},
							  accepted: { type: Datatypes.BOOLEAN,
							  			  defaultValue: false
							  			}
						});
};