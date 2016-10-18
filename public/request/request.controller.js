(function() { 
  angular
    .module('meanApp')
    .controller('requestController', requestController);
 	requestController.$inject = ['$location','$http','$scope'];
    function requestController ($location,$http,$scope) {
      console.log('khanh is inside requestController');
      $scope.requestedItems = [];
      //Retrieve all the requested items to show the request page
      $http.get('/api/requestedItem/get')
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.requestedItems = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      
    }// end requestController

})();