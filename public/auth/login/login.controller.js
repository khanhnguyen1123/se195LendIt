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
    $scope.alert = {
      'class' : '',
      'message' : '',
      'show' : false,
    };

    $scope.vm.onSubmit = function () {
      authentication
        .login($scope.vm.credentials)
        .error(function(err){          
          $scope.alert = {
            'class' : 'alert-danger',
            'message' : 'Incorrent login information',
            'show' : true,
          };
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }

})();