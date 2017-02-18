(function() {
  
  angular
    .module('meanApp')
    .controller('publicProfileController', publicProfileController);

  publicProfileController.$inject = ['$scope','$http','$stateParams'];
  function publicProfileController($scope,$http,$stateParams) {
    $scope.vm = this;

    $scope.vm.user = {};

    var id = $stateParams.random;
    
    $http.get('/api/profile/get/'+id)
      .success(function(data){       
            $scope.vm.user = data;
          })
          .error(function(error) {
            console.log('Error: ' + error);
          });
     
     

  }  // end profileCtrl

})();