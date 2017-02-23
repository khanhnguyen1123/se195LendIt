(function() {
  
  angular
    .module('meanApp')
    .controller('publicProfileController', publicProfileController);
  publicProfileController.$inject = ['$scope','$http','$stateParams'];

  function publicProfileController($scope,$http,$stateParams) {
    $scope.user = {};
    $scope.averageRating = 1.1;
    var id = $stateParams.random;
    $http.get('/api/profile/get/'+id)
      .success(function(data){       
        $scope.user = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });
  }
})();