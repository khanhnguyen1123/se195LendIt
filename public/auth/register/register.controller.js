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
      $scope.alert = {
        'class' : '',
        'message' : '',
        'show' : false,
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
        //console.log('Submitting registration');
        if($scope.checkPassword == false && ($scope.vm.credentials.name != "")&&($scope.vm.credentials.email != "")){
          authentication
          .register($scope.vm.credentials)
          .error(function(err){
            $scope.alert = {
              'class' : 'alert-danger',
              'message' : err,
              'show' : true,
            };
          })
          .then(function(){
            $location.path('profile');
          });
        }
        else{
          $scope.alert = {
            'class' : 'alert-danger',
            'message' : 'Password do not match',
            'show' : true,
          };
        }
        
      };

   }]);

})();