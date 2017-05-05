(function () {

  angular
    .module('meanApp')
   // .controller('registerCtrl', registerCtrl);
 
   .controller('registerCtrl',['$scope','$location','authentication','$window', function($scope, $location,authentication,$window){
     $scope.vm = this;
     $scope.checkPassword = null;
    $scope.vm.credentials = {
      name : "",
      email : "",
      password : "",
      retypepassword: ""
    };


    $scope.$watch("vm.credentials.password",function(){
      if (($scope.vm.credentials.password != $scope.vm.credentials.retypepassword) && ($scope.vm.credentials.password != "")){
        $scope.checkPassword = true;
      }  
      
      $scope.$watch("vm.credentials.retypepassword",function(){
        if($scope.vm.credentials.password == $scope.vm.credentials.retypepassword && ($scope.vm.credentials.password != ""))
          $scope.checkPassword = false;
      });// end inside watch
    });
    $scope.$watch("vm.credentials.retypepassword",function(){
      if (($scope.vm.credentials.password != $scope.vm.credentials.retypepassword) && ($scope.vm.credentials.password != "")){
        $scope.checkPassword = true;
      }  
      
      $scope.$watch("vm.credentials.password",function(){
        if($scope.vm.credentials.password == $scope.vm.credentials.retypepassword && ($scope.vm.credentials.password != ""))
          $scope.checkPassword = false;
      });// end inside watch
    });

    $scope.vm.onSubmit = function () {
      console.log('Submitting registration');
      if($scope.checkPassword == false && ($scope.vm.credentials.name != "")&&($scope.vm.credentials.email != "")){
        authentication
        .register($scope.vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
      }
      else{
        $window.alert("Please enter correct Matching Passwords");
        return;
      }
      
    };


   }]);

/*
  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };
    console.log('this is khanh test inside register controller'+ this);

    vm.onSubmit = function () {
      console.log('Submitting registration');
      authentication
        .register(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

  }
*/
})();