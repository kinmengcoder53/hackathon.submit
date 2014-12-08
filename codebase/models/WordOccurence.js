var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    occurence       : Number
  , text      : String
  , positive : Boolean
});

schema.statics.getPositiveWords = function(callback) {

  var words = [];
  WordOccurence.find({'positive': true}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      words = docs;  
    }

    // Pass them back to the specified callback
    callback(words);

  });

};

schema.statics.getNegativeWords = function(callback) {

  var words = [];
  WordOccurence.find({'positive': false}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      words = docs;  
    }

    // Pass them back to the specified callback
    callback(words);

  });

};

schema.statics.getWord = function(word, callback) {

  var words = [];
  WordOccurence.find({'text': word}).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      words = docs;  
    }

    // Pass them back to the specified callback
    callback(words);

  });

};

module.exports = WordOccurence = mongoose.model('WordOccurence', schema);