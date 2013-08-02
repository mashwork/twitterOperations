var twitter = require("ntwitter");

var twit = new twitter(require("../config/config.js").config);

twit
	.verifyCredentials(function (err, data) {
		console.log(data);
	})
	.updateStatus(
		'Test tweet from ntwitter/' + twitter.VERSION,
		function (err, data) {
			console.log(data);
		}
	);