(function() { 
  angular
    .module('meanApp')
    .controller('lendingController', lendingController);
 	lendingController.$inject = ['$location','$http','$scope'];
    function lendingController ($location,$http,$scope) {
      console.log('khanh is inside lendingController');
      $scope.lendingItems = [];
      //Retrieve all the requested items to show the request page
      $http.get('/api/lendingItem/get')
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.lendingItems = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      
    }// end requestController

})();