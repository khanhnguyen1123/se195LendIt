(function () {

  angular
  .module('meanApp')
  .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$scope','$location', 'authentication'];
  function loginCtrl($scope,$location, authentication) {
    $scope.vm = this;

    $scope.vm.credentials = {
      email : "",
      password : ""
    };

    $scope.vm.onSubmit = function () {
      authentication
        .login($scope.vm.credentials)
        .error(function(err){
          console.log("khanh in side login controller error ");
          alert(err);

        })
        .then(function(){
          $location.path('profile');
        });
    };

  }

})();