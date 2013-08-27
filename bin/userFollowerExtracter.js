var twitter = require("ntwitter"),
	_ = require("lodash"),
	async = require("async"),
	twit = new twitter(require("../config/config.js").config),
	screenNames = _.rest(process.argv,2);

console.log("screenNames = %j", screenNames);
console.log("https://api.twitter.com/1.1/followers/ids.json")

var timeout = 60000;

async.mapSeries(
	screenNames,
	function(screenName, iterCallback){
		getFollowers(screenName, iterCallback);
	},
	function(err, screenNamesArray){
		var intersectIds = _.intersection.apply(this, screenNamesArray);
		console.log("intersectIds = %j", intersectIds);
	}
);

function getFollowers(screenName, callback){
	var collectedFollowers = [];

	function getFollowersPartial(cursor){
		twit
			.get(
				"https://api.twitter.com/1.1/followers/ids.json",
				{ screen_name: screenName,
					cursor: cursor },
				function (err, data) {
					if (err){ return callback(err, null);}

					collectedFollowers = collectedFollowers.concat(data.ids);
					console.log("screenName " + screenName + " number recieved so far " + collectedFollowers.length);
					
					setTimeout(function () {
						if(data.next_cursor != 0){return getFollowersPartial(data.next_cursor); }

						callback(null, collectedFollowers);
						},
						timeout
					);
				}
			);
	}
	getFollowersPartial(-1);
}
