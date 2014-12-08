var WordOccurence = require('../models/WordOccurence');

module.exports = function(pubnub, positiveWords, negativeWords){
    
    if(positiveWords.length > 0) {
        for(var i=0; i< positiveWords.length; i++) {
            var currentPositiveWord = positiveWords[i];
            WordOccurence.getWord(currentPositiveWord.toLowerCase(), function(words) {
               if(words.lenth > 0) {
                    var currentWordOccurence = words[0];
                    var result = {
                        'occurence': currentWordOccurence.occurence + 1
                        , 'text': currentWordOccurence.text
                        , 'positive': currentWordOccurence.positive
                    };
                    WordOccurence.update({'_id': currentWordOccurence.id}, {'$inc': {'occurence': 1}}, function(err) {
                        if(!err) {
                            pubnub.publish({ 
                            channel   : 'mhi_positiveCloud',
                            message   : result,
                            callback  : function(e) { console.log( "SUCCESS!", e ); },
                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                            });
                        }
                    });
               } else {
                    result = {
                       'occurence' : 1
                        , 'text'      : currentPositiveWord.toLowerCase()
                        , 'positive' : true
                   };
                   
                   var wordOccurenceEntry = new WordOccurence(result);
                   
                   wordOccurenceEntry.save(function(err) {
                      if (!err) {
                        pubnub.publish({ 
                            channel   : 'mhi_positiveCloud',
                            message   : result,
                            callback  : function(e) { console.log( "SUCCESS!", e ); },
                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                        });
                        
                      }
                    });
                }
            });
        }
    }
    
    if(negativeWords.length > 0) {
        for(var j=0; j< negativeWords.length; j++) {
            var currentNegativeWord = negativeWords[j];
            WordOccurence.getWord(currentNegativeWord.toLowerCase(), function(words) {
               if(words.lenth > 0) {
                    var currentWordOccurence = words[0];
                    var result = {
                        'occurence': currentWordOccurence.occurence + 1
                        , 'text': currentWordOccurence.text
                        , 'positive': currentWordOccurence.positive
                    };
                    WordOccurence.update({'_id': currentWordOccurence.id}, {'$inc': {'occurence': 1}}, function(err) {
                        if(!err) {
                            pubnub.publish({ 
                            channel   : 'mhi_negativeCloud',
                            message   : result,
                            callback  : function(e) { console.log( "SUCCESS!", e ); },
                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                            });
                        }
                    });
               } else {
                    result = {
                       'occurence' : 1
                        , 'text'      : currentNegativeWord.toLowerCase()
                        , 'positive' : false
                   };
                   
                   var wordOccurenceEntry = new WordOccurence(result);
                   
                   wordOccurenceEntry.save(function(err) {
                      if (!err) {
                        pubnub.publish({ 
                            channel   : 'mhi_negativeCloud',
                            message   : result,
                            callback  : function(e) { console.log( "SUCCESS!", e ); },
                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                        });
                        
                      }
                    });
                }
            });
        }
    }
    
};