/////////////////////
// ROOT CONTROLLER //
/////////////////////

exports.index = function(req, res) {
	console.log('Redirecting -> RootController.index');
	res.redirect('/index.html');
};

exports.output = function (req, res) {
	console.log('Redirecting -> RootController.output');
	res.render('output', { testVar: 'test' });
};