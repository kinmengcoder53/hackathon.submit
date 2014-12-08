var mongoose = require('mongoose');


var schema = new mongoose.Schema({
    index       : Number
  , date       : Date
});


schema.statics.getIndexes = function(callback) {

  var indexes = [];
  CurrentIndex.find().sort({date: 'desc'}).limit(20).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      indexes = docs;  
    }

    // Pass them back to the specified callback
    callback(indexes);

  });

};

schema.statics.getCurrentIndex = function(callback) {

  var indexes = [];
  CurrentIndex.find().sort({date: 'desc'}).limit(1).exec(function(err,docs){

    // If everything is cool...
    if(!err) {
      indexes = docs;  
    } else {
        console.err(err);
    }

    // Pass them back to the specified callback
    callback(indexes);

  });

};

module.exports = CurrentIndex = mongoose.model('CurrentIndex', schema);