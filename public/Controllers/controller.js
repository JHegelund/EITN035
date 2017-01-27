var app = angular.module('myApp', []);


app.controller('UserController', function($scope, $http, $timeout) {

    $scope.sources = {};
    $scope.urlSource = {};
    $scope.comment = {};
    $scope.rating = {};
    $scope.typeOf = {};

    var sourceList =[];

    $scope.searchBtn = true;
    $scope.oldModal = true;




    $scope.search = function() {

        console.log($scope.sources);
        console.log($scope.searchQuery);

        $scope.searchBtn = false;
        $scope.loading = true;
        $scope.searchCol = false;
        $scope.twitterCol = false;

        //* Google Search *//

        $http.post('/search', {sourceArray: $scope.sources, searchQuery: $scope.searchQuery}).success(function (res) {

            $scope.list = res;
            console.log($scope.list);


            $scope.searchBtn = true;
            $scope.loading = false;
            $scope.searchCol = true;
        });

        //* Twitter Search *//

        if($scope.sources.hasOwnProperty('https://twitter.com/') && $scope.sources['https://twitter.com/'] === true)
        {
            $http.post('/searchTwitter', {searchQuery: $scope.searchQuery}).success(function (res) {

                $scope.twitterList = res;
                $scope.twitterCol = true;
                console.log($scope.twitterList);
            });
        }


    }

    //* Add to database call *//

    $scope.addToDb = function(theUrl, index, theDate, theTags) {
        $http.post('/api', {url: theUrl, com: $scope.comment[index], rate:$scope.rating[index], date: theDate, tags: theTags, type: $scope.typeOf[index]}).success(function(res){
        });
        $scope.addedToDb = true;
        $timeout(function () { $scope.addedToDb = false; }, 4000);
    };

    //* Get article information call *//

    $scope.unfluff = function(uUrl) {
        $scope.loadingModal = true;
        $scope.oldModal = false;



        $http.post('/unfluff', {unfluffUrl: uUrl}).success(function(res){
            $scope.dataContent = res;
                console.log($scope.dataContent);
            $scope.loadingModal = false;
            $scope.oldModal = true;
            });
        };

});
