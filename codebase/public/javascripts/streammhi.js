function initialize() {
  var myLatlng = new google.maps.LatLng(4.692481, 108.613084);
  var myOptions = {
    zoom: 6,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  var heatmap;
  var negativeIndexes = new google.maps.MVCArray();
  var positiveIndexes = new google.maps.MVCArray();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: negativeIndexes,
    radius: 20
  });
  var negativeGradient = ['rgba(255, 0, 0, 0)','rgba(255, 0, 0, 0.25)',
  'rgba(255, 0, 0, 0.5)', 'rgba(255, 0, 0, 0.75)','rgba(255, 0, 0, 1)'];
  heatmap.set('gradient', negativeGradient);
  heatmap.setMap(map);
  
  var positiveHeatMap = new google.maps.visualization.HeatmapLayer({
    data: positiveIndexes,
    radius: 20
  });
  var positiveGradient = ['rgba(0, 255, 0, 0)','rgba(0, 255, 0, 0.25)',
  'rgba(0, 255, 0, 0.5)', 'rgba(0, 255, 0, 0.75)','rgba(0, 255, 0, 1)'];
  positiveHeatMap.set('gradient', positiveGradient);
  positiveHeatMap.setMap(map);

  var pubnub = PUBNUB.init({
     subscribe_key: 'sub-c-6c4c3056-7d53-11e4-b601-02ee2ddab7fe'
  });
  
  pubnub.subscribe({
    channel: 'mhi_heatmap',
    message: function(m){
        var originalWeight = m['originalWeight'];
        if(originalWeight >=0) {
            var locationObj = m['loc'];
            var coordinates = locationObj['coordinates'];
            var point = { 'location':new google.maps.LatLng(coordinates[1], coordinates[0])
            , 'weight': originalWeight};
            positiveIndexes.push(point);
        } else {
            locationObj = m['loc'];
            coordinates = locationObj['coordinates'];
            point = { 'location':new google.maps.LatLng(coordinates[1], coordinates[0])
            , 'weight': m['weight']};
            negativeIndexes.push(point);
        }
        
    }
  });
  
  pubnub.subscribe({
    channel: 'mhi_currentIndex',
   message : function(m){
       console.log(m);
       var index = m['index'];
       document.getElementById('current_index').innerHTML = "Current Index: " + Number(index).toFixed(2);
   }
  });
  
  
}