(function() {
  
  angular
    .module('meanApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$scope','$location', 'meanData','$http','authentication'];
  function profileCtrl($scope,$location, meanData,$http,authentication) {
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

     
     $scope.reload = function(){
        
        // reload new data
        meanData.getProfile()
          .success(function(data) {
            $scope.vm.user = data;
            console.log('khanh print out data in profile controller'+data.email);
          })
          .error(function (e) {
            console.log(e);
          });
  
     };

  }  // end profileCtrl

})();