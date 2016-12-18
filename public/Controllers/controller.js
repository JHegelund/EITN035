var app = angular.module('myApp', []);


app.controller('UserController', function($scope, $http) {

    $scope.sources = {};
    $scope.urlSource = {};

    $scope.save = function() {
        console.log($scope.sources);
        console.log($scope.searchQuery);

        angular.element(document.getElementById('search'))[0].disabled = true;

        $http.post('/search', {sourceArray: $scope.sources, searchQuery: $scope.searchQuery}).success(function(res){
            console.log("preferences sent");
        });

        /*.error(function(data, status){
         $scope.error = data;
         console.log($scope.error, status);
         });*/

        
        $http.get('/searchReturn').success(function(res){

            console.log("I got the data");
            $scope.list = res;
            console.log($scope.list);
            angular.element(document.getElementById('search'))[0].disabled = false;
            
        });
    };


    $scope.addToDb = function(theUrl) {

        console.log(theUrl);

        $http.post('/api', {url: theUrl}).success(function(res){

        });

    };

    

});
