
$(document).ready(function(){/* google maps -----------------------------------------------------*/
    google.maps.event.addDomListener(window, 'load', initialize);

    function initialize() {

      /* position Amsterdam */
      var latlng = new google.maps.LatLng(10.822928, 106.630007);

      var mapOptions = {
        center: latlng,
        scrollWheel: false,
        zoom: 13
      };

      var marker = new google.maps.Marker({
        position: latlng,
        url: '/',
        animation: google.maps.Animation.DROP
      });

      var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
      marker.setMap(map);

    };
/* end google maps -----------------------------------------------------*/

    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function(html) {
      var switchery = new Switchery(html);
    });
});