var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    weight       : Number
  , loc: {
      type: { type: String }, 
      coordinates: []
    }
  , date       : Date
  , originalWeight: Number
});

schema.index({ loc : '2dsphere' });
schema.statics.getSentiments = function(callback) {

  var sentiments = [];
  var currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 1);
  Sentiment.find({date: {$gte: currentDate}}).sort({date: 'desc'}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      sentiments = docs;  
    }

    // Pass them back to the specified callback
    callback(sentiments);

  });

};

schema.statics.getSentimentsBetweenDates = function(startDate, endDate, callback) {

  var sentiments = [];
  Sentiment.find({"date": {"$gte": startDate, "$lt": endDate}}).sort({date: 'desc'}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      sentiments = docs;  
    }

    // Pass them back to the specified callback
    callback(sentiments);

  });

};

module.exports = Sentiment = mongoose.model('Sentiment', schema);