(function() {
  
  angular
    .module('meanApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$scope','$location', 'meanData'];
  function profileCtrl($scope,$location, meanData) {
     $scope.vm = this;

    $scope.vm.user = {};

    meanData.getProfile()
      .success(function(data) {
        $scope.vm.user = data;
        console.log('khanh print out data in profile controller'+data.email);
      })
      .error(function (e) {
        console.log(e);
      });
  }

})();