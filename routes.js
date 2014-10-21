var RootController 		= require('./controllers/index').RootController;

module.exports = function(app, passport) {
	app.get('/', RootController.index);
	app.get('/:id', RootController.output);
};