(function() { 
  angular
    .module('meanApp')
    .controller('requestingCategoryController', requestingCategoryController);
 	requestingCategoryController.$inject = ['$location','$http','$scope','$stateParams'];
    function requestingCategoryController ($location,$http,$scope,$stateParams) {
      console.log('khanh is inside requestingCategoryController');
      $scope.requestedItems = {};
      //Retrieve a particular items to show in the detail page
      var category = $stateParams.fixedCategory;
      console.log('khanh tesing passing id to detail controller :' + category);
      $http.get('/api/requestedItemCategory/get/'+category)
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.requestedItems = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      
    }// end requestController

})();