(function() { 
  angular
    .module('meanApp')
    .controller('lendingItemDetailController', lendingItemDetailController);
 	lendingItemDetailController.$inject = ['$location','$http','$scope','$stateParams'];
    function lendingItemDetailController ($location,$http,$scope,$stateParams) {
      console.log('khanh is inside detailController');
      $scope.rentItem = {};
      //Retrieve a particular items to show in the detail page
      var id = $stateParams.random;
      console.log('khanh tesing passing id to detail controller :' + id);
      $http.get('/api/lendingItem/get/'+id)
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.rentItem = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      
    }// end requestController

})();