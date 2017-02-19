(function() { 
  angular
    .module('meanApp')
    .controller('requestItemController', requestItemController);
  requestItemController.$inject = ['$location','$http','$scope','$stateParams'];
  
  function requestItemController ($location,$http,$scope,$stateParams) {
    $scope.requestedItem = {};
    //Retrieve a particular items to show in the detail page
    let id = $stateParams.random;
    $http.get('/api/requestedItem/get/'+id)
      .success(function(data){
        console.log(JSON.stringify(data));
        $scope.requestedItem = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
      
  }
})();
                    