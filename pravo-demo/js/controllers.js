var app = angular.module('Pravo', ['ngSanitize', 'NgSwitchery']);


app.controller("ListingCtrl", function($scope) {
    // Determine how big each card should be
    var postWidth = ($(".listing-column").innerWidth()/4 | 0) - 30;
    $scope.postWidth = postWidth;
    $scope.postWidthPx = postWidth + "px";
    // Assign listings
    $scope.listings = listings;
})