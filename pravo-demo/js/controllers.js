var app = angular.module('Pravo', ['ngAnimate','ngSanitize', 'NgSwitchery']);


app.controller("ListingCtrl", function($scope, $timeout) {
    // Determine how big each card should be
    var postWidth = ($(".listing-column").innerWidth()/3 | 0) - 15;
    if ($("body").innerWidth() > 1600) {
        postWidth = ($(".listing-column").innerWidth()/4 | 0) - 15;
    }
    $scope.postWidth = postWidth;
    $scope.postWidthPx = postWidth + "px";

    // Assign listings and pagination impl
    $scope.PAGE_LIMIT = 10;
    $scope.MAX_PAGE = 2;
    $scope.page = function(start, limit, listings) {
        var end = Math.min(start+limit, listings.length);
        return listings.slice(start, end);
    };
    $scope.listings = $scope.page(0, $scope.PAGE_LIMIT, listings);
    // Pagination logic
    $scope.currentPage = 1;
    $scope.emptyPage =function() {
        $scope.listings.splice(0, $scope.listings.length);
    }
    $scope.nextPage = function() {
        $scope.emptyPage();
        $timeout(function(){
            $scope.currentPage = Math.min($scope.currentPage+1, $scope.MAX_PAGE);
            var listingPage = $scope.page(($scope.currentPage-1)*$scope.PAGE_LIMIT, $scope.PAGE_LIMIT, listings);
            for(var key in listingPage) {
                $scope.listings.push(listingPage[key]);
            }
        }, 750);
    }
    $scope.prevPage = function() {
        $scope.emptyPage();
        $timeout(function(){
            $scope.currentPage = Math.max($scope.currentPage-1, 1);
            var listingPage = $scope.page(($scope.currentPage-1)*$scope.PAGE_LIMIT, $scope.PAGE_LIMIT, listings);
            for(var key in listingPage) {
                $scope.listings.push(listingPage[key]);
            }
        }, 750);
    }
    $scope.$on('lastPreviewCallback', function(scope, element, attrs){
        Holder.run({images:".holder"});
    });
});