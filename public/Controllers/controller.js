var app = angular.module('myApp', []);


app.controller('UserController', function($scope, $http) {

    $scope.sources = {};

    $scope.save = function() {
        console.log($scope.sources);
        console.log($scope.searchQuery);
        $http.post('/search', {sourceArray: $scope.sources, searchQuery: $scope.searchQuery}).success(function(res){
            console.log("preferences sent");

        });
        $http.get('/searchReturn').success(function(res){

            console.log("I got the data");
            $scope.list = res;
            console.log($scope.list);
        });
    };
});
