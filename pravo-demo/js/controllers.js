var app = angular.module('Pravo', ['ngSanitize', 'NgSwitchery']);


app.controller("ListingCtrl", function($scope) {
    // Determine how big each card should be
    var postWidth = ($(".listing-column").innerWidth()/3 | 0) - 15;
    if ($("body").innerWidth() > 1600) {
        postWidth = ($(".listing-column").innerWidth()/4 | 0) - 15;
    }
    $scope.postWidth = postWidth;
    $scope.postWidthPx = postWidth + "px";
    // Assign listings
    $scope.page = function(start, limit, listings) {
        var end = Math.min(start+limit, listings.length);
        return listings.slice(start, end);
    };
    $scope.listings = $scope.page(0, 10, listings);
});