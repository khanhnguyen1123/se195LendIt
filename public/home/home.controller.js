(function() { 
   angular
      .module('meanApp')
      .controller('homeCtrl', homeCtrl);
   homeCtrl.$inject = ['$scope', '$location', 'authentication', 'meanData'];

   function homeCtrl ($scope, $location, authentication, meanData) {
      //console.log('Home Controller is Running');

      //TBD
      //Fix Home Page, Delete Messages, Fix User Model to View Message Chains, Add Reply
      $scope.user = {};
      $scope.form = {
         email : "",
         password : ""
      };
      $scope.loggedIn = authentication.isLoggedIn();

      let message = 
      {
         "userImg" : "https://cdn.filepicker.io/api/file/d88adUzMQ4yg0FXN5hTp",
         "user" : "User ID",
         "username" : "Name",
         "date" : new Date(),
         "title" : "Message Title",
         "content" : "Content"
      }
      
      //Check Logged In and Hide Sign In Form
      if ($scope.loggedIn) {
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
               $scope.user.messages.push(message);
            })
            .error(function (e) {
               console.log(e);
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