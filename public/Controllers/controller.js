var app = angular.module('myApp', []);


app.controller('UserController', function($scope, $http) {

    $scope.sources = {};
    $scope.urlSource = {};
    $scope.comment = {};
    $scope.rating = {};
    $scope.typeOf = {};

    $scope.searchBtn = true;
    $scope.oldModal = true;

    $scope.search = function() {
        console.log($scope.sources);
        console.log($scope.searchQuery);

        $scope.searchBtn = false;
        $scope.loading = true;

        $http.post('/search', {sourceArray: $scope.sources, searchQuery: $scope.searchQuery}).success(function(res){

            $scope.list = res;
            console.log($scope.list);

            $scope.searchBtn = true;
            $scope.loading = false;
        });


        

    };


    $scope.addToDb = function(theUrl, index, theDate, theTags) {

        $http.post('/api', {url: theUrl, com: $scope.comment[index], rate:$scope.rating[index], date: theDate, tags: theTags, type: $scope.typeOf[index]}).success(function(res){

        });

    };

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
