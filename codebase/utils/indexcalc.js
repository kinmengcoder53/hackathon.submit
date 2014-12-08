var mongoose = require('mongoose');
var CurrentIndex = require('../models/CurrentIndex');
var Sentiment = require('../models/Sentiment');
var currentDate = new Date();

module.exports = function(pubnub){
CurrentIndex.getCurrentIndex(function(indexes) {
    console.log("Get Current Index.");
    if(indexes.length > 0) {
        console.log("Found index: " + indexes[0] );
        var currentIndex = indexes[0];
        var currentIndexDate = currentIndex.date;
        
        var difference = currentDate.getTime() - currentIndexDate.getTime(); // This will give difference in milliseconds
        var resultInMinutes = Math.round(difference / 60000);
        
        if(resultInMinutes >= 60) {
            console.log("Result longer than 60 minutes.");
            var startDate = new Date(currentDate.getTime());
            startDate.setHours(startDate.getHours() - 1);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            
            var endDate = new Date(startDate.getTime());
            endDate.setHours(endDate.getHours() + 1);
            Sentiment.getSentimentsBetweenDates(startDate, endDate, function(sentiments) {
               var total = 0.0;
               var count = 0;
               for (var i=0; i<sentiments.length;i++) {
                   var currentSentiment = sentiments[i];
                   total += currentSentiment.originalWeight;
                   count++;
               }
               
               var average = 0.0;
               if(sentiments.length > 0) {
                 average = total / count;
               }
               
               var result = {
                   index: average,
                   date: startDate
               };
               CurrentIndex.update({"_id": currentIndex.id}, {"$set": result}, function(err) {
                   if (!err) {
                        pubnub.publish({ 
                            channel   : 'mhi_historyIndex',
                            message   : result,
                            callback  : function(e) { console.log( "SUCCESS!", e ); },
                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                        });
                   }
               });
            });
            
            startDate = new Date(currentDate.getTime());
            startDate.setMinutes(0);
            startDate.setSeconds(0);
                
            endDate = new Date(startDate.getTime());
            endDate.setHours(endDate.getHours() + 1);
            Sentiment.getSentimentsBetweenDates(startDate, endDate, function(sentiments) {
               var total = 0.0;
               var count = 0;
               for (var i=0; i<sentiments.length;i++) {
                   var currentSentiment = sentiments[i];
                   total += currentSentiment.originalWeight;
                   count++;
               }
                   
               var average = 0.0;
               if(sentiments.length > 0) {
                 average = total / count;
               }
                   
               var result = {
                   index: average,
                   date: startDate
                       
               };
                   
               var currentIndexEntry = new CurrentIndex(result);
               currentIndexEntry.save(function(err) {
                   if (!err) {
                        pubnub.publish({ 
                            channel   : 'mhi_currentIndex',
                            message   : result,
                            callback  : function(e) { console.log( "SUCCESS!", e ); },
                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                        });
                   }
                })
                   
            });
        } else {
            console.log("Result shorter than 60 minutes.");
            startDate = new Date(currentDate.getTime());
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            
            endDate = new Date(startDate.getTime());
            endDate.setHours(endDate.getHours() + 1);
            Sentiment.getSentimentsBetweenDates(startDate, endDate, function(sentiments) {
               var total = 0.0;
               var count = 0;
               for (var i=0; i<sentiments.length;i++) {
                   var currentSentiment = sentiments[i];
                   total += currentSentiment.originalWeight;
                   count++;
               }
               
               var average = 0.0;
               if(sentiments.length > 0) {
                 average = total / count;
               }
               
               var result = {
                   index: average,
                   date: startDate
               };
               CurrentIndex.update({"_id": currentIndex.id}, {"$set": result}, function(err) {
                   if (!err) {
                        pubnub.publish({ 
                            channel   : 'mhi_currentIndex',
                            message   : result,
                            callback  : function(e) { console.log( "SUCCESS!", e ); },
                            error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                        });
                   }
               });
            });
        }
        
        
    } else {
        console.log("Current Index Not Found.");
        startDate = new Date(currentDate.getTime());
        startDate.setMinutes(0);
        startDate.setSeconds(0);
            
        endDate = new Date(startDate.getTime());
        endDate.setHours(endDate.getHours() + 1);
        Sentiment.getSentimentsBetweenDates(startDate, endDate, function(sentiments) {
           console.log("sentiments number: " + sentiments.length);
           var total = 0.0;
           var count = 0;
           for (var i=0; i<sentiments.length;i++) {
               var currentSentiment = sentiments[i];
               total += currentSentiment.originalWeight;
               count++;
           }
           
           var average = 0.0;
           if(sentiments.length > 0) {
             average = total / count;
           }
               
           var result = {
               index: average,
               date: startDate
                   
           };
               
           var currentIndexEntry = new CurrentIndex(result);
           currentIndexEntry.save(function(err) {
               if (!err) {
                    pubnub.publish({ 
                        channel   : 'mhi_currentIndex',
                        message   : result,
                        callback  : function(e) { console.log( "SUCCESS!", e ); },
                        error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
                    });
               } 
            })
               
        });
    }
});
}