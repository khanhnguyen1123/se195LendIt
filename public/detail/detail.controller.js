(function() { 
  angular
    .module('meanApp')
    .controller('detailController', detailController);
 	detailController.$inject = ['$location','$http','$scope','$stateParams'];
    function detailController ($location,$http,$scope,$stateParams) {
      console.log('khanh is inside detailController');
      $scope.requestedItem = {};
      //Retrieve a particular items to show in the detail page
      var id = $stateParams.random;
      console.log('khanh tesing passing id to detail controller :' + id);
      $http.get('/api/requestedItem/get/'+id)
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.requestedItem = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      
    }// end requestController

})();