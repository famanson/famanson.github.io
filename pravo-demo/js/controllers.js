var app = angular.module('Pravo', ['ngSanitize', 'NgSwitchery']);


app.controller("ListingCtrl", function($scope) {
    // Determine how big each card should be
    var postWidth = ($(".listing-column").innerWidth()/3 | 0) - 15;
    if ($("body").innerWidth() > 1600) {
        postWidth = ($(".listing-column").innerWidth()/4 | 0) - 15;
    }
    $scope.postWidth = postWidth;
    $scope.postWidthPx = postWidth + "px";

    // Assign listings and pagination impl
    $scope.LIMIT = 10;
    $scope.MAX_PAGE = 2;
    $scope.page = function(start, limit, listings) {
        var end = Math.min(start+limit, listings.length);
        return listings.slice(start, end);
    };
    $scope.listings = $scope.page(0, $scope.LIMIT, listings);
    // Pagination logic
    $scope.currentPage = 1;
    $scope.nextPage = function() {
        $scope.currentPage = Math.min($scope.currentPage+1, $scope.MAX_PAGE);
        $scope.listings = $scope.page(($scope.currentPage-1)*$scope.LIMIT, $scope.LIMIT, listings);
    }
    $scope.prevPage = function() {
        $scope.currentPage = Math.max($scope.currentPage-1, 1);
        $scope.listings = $scope.page(($scope.currentPage-1)*$scope.LIMIT, $scope.LIMIT, listings);
    }
    $scope.$on('lastPreviewCallback', function(scope, element, attrs){
        Holder.run({images:".holder"});
    });
});