(function() { 
  angular
    .module('meanApp')
    .controller('rentItemController', rentItemController);
  rentItemController.$inject = ['$location','$http','$scope','$stateParams'];

  function rentItemController ($location,$http,$scope,$stateParams) {
    $scope.rentItem = {};
    
    var id = $stateParams.random;
    $http.get('/api/lendingItem/get/'+id)
      .success(function(data){
        console.log(JSON.stringify(data));
        $scope.rentItem = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
      
  }

})();