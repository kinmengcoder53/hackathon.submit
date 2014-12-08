var twitter = require('twitter'),
util = require('util')
config = require('../config'),
twitterStreamHandler = require('../utils/twitterstreamhandler');
var sentiment = require('sentiment');

var twit = twitter(config.twitter);

twit.stream('statuses/filter',{ 'locations': '100.702713, 1.303148, 119.258835, 7.037783'}, function(stream){
  stream.on('data', function(data) {
      console.log(data);
      var text = data.text;
      var sentimentResult = sentiment(text);
      console.log(sentimentResult);
});
  setTimeout(stream.destroy, 5000);
});