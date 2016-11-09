(function() { 
  angular
    .module('meanApp')
    .controller('lendingCategoryController', lendingCategoryController);
  lendingCategoryController.$inject = ['$location','$http','$scope','$stateParams'];
    function lendingCategoryController ($location,$http,$scope,$stateParams) {
      console.log('khanh is inside lendingCategoryController');
      $scope.lendingItems = {};
      //Retrieve a particular items to show in the detail page
      var category = $stateParams.fixedCategory;
      console.log('khanh tesing passing category to detail controller :' + category);
      $http.get('/api/lendingItemCategory/get/'+category)
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.lendingItems = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      
    }// end requestController

})();
