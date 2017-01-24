var app = angular.module('myApp', []);


app.controller('UserController', function($scope, $http) {

    $scope.sources = {};
    $scope.urlSource = {};
    $scope.comment = {};
    $scope.rating = {};

    $scope.save = function() {
        console.log($scope.sources);
        console.log($scope.searchQuery);

        angular.element(document.getElementById('search'))[0].disabled = true;

        $http.post('/search', {sourceArray: $scope.sources, searchQuery: $scope.searchQuery}).success(function(res){
            console.log("preferences sent");
            $scope.list = res;
            console.log($scope.list);
            angular.element(document.getElementById('search'))[0].disabled = false;
        });

        /*.error(function(data, status){
         $scope.error = data;
         console.log($scope.error, status);
         });*/

        

    };


    $scope.addToDb = function(theUrl, index, theDate, theTags) {
        
        $http.post('/api', {url: theUrl, com: $scope.comment[index], rate:$scope.rating[index], date: theDate, tags: theTags}).success(function(res){

        });

    };

    $scope.unfluff = function(uUrl) {
            $http.post('/unfluff', {unfluffUrl: uUrl}).success(function(res){
                $scope.dataContent = res;
                console.log($scope.dataContent);
            });
        };

});
