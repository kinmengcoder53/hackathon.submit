
/*
 * GET home page.
 */
var Sentiments = require('../models/Sentiment');
var CurrentIndex = require('../models/CurrentIndex');
var WordOccurence = require('../models/WordOccurence');

exports.index = function(req, res){
    
  Sentiments.getSentiments(function(sentimentList) {
      
      CurrentIndex.getIndexes(function(indexes) {
          var currentIndex = 0;
          if(indexes.length > 0) {
             currentIndex = indexes[0].index;
             
          } 
          
          res.render('index', { title: 'Express', 'sentimentList': sentimentList
          , 'currentIndex': currentIndex
          , 'indexHistoryList': indexes});
      });
      
      
  })
    
  
};