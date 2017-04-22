(function() { 
   angular
      .module('meanApp')
      .controller('homeCtrl', homeCtrl);
   homeCtrl.$inject = ['$scope', '$location', 'authentication', 'meanData', '$http'];

   function homeCtrl ($scope, $location, authentication, meanData, $http) {
      //console.log('Home Controller is Running');

      //Fix Home Page, Delete Messages, Fix User Model to View Message Chains, Add Reply
      $scope.user = {};
      $scope.form = {
         email : "",
         password : ""
      };
      $scope.loggedIn = authentication.isLoggedIn();
      
      //Check Logged In and Hide Sign In Form
      if ($scope.loggedIn) {
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
            })
            .error(function (e) {
               console.log(e);
            })
            .finally( function() {
               getMessages();
            });
      }
      //Login In Function
      $scope.signIn = function () {
         authentication
            .login($scope.form)
            .error(function(err) {
               $scope.message = "Invalid information. Please try again.";
               console.log($scope.message);
            })
            .then(function () {
               $location.path('profile');
            });
      };
   }

})();