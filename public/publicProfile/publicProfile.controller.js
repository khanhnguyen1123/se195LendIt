(function() {
  
  angular
    .module('meanApp')
    .controller('publicProfileController', publicProfileController);
  publicProfileController.$inject = ['$scope','$http','$stateParams', 'authentication','$window'];

  function publicProfileController($scope,$http,$stateParams, authentication,$window) {
    $scope.user = {};
    $scope.message = {};
    $scope.loggedIn = authentication.isLoggedIn();

    let id = $stateParams.random;
    $http.get('/api/profile/get/'+id)
      .success(function(data){       
        $scope.user = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });

    $scope.sendMessage = function () {
      //TBD
      console.log("Message Sent receiverId : "+$scope.user._id + " name "+ $scope.user.name);
      var creatMessage = {
        ownerId: authentication.currentUser()._id,
        ownerName: authentication.currentUser().name,
        receiverId: $scope.user._id,
        receiverName: $scope.user.name,
        subject: $scope.message.subject,
        content: $scope.message.content
      }; 

       $http.post('/api/message/send',creatMessage)
       .success(function(data){       
          console.log("after send message : "+data.message);
          $window.alert("Message was Sent ");
        })
       .error(function(error) {
          console.log('Error: ' + error);
        }); // end http call
    }; // end send message function

    $scope.sendReview = function () {
      //TBD
      console.log("Review Sent");
    }

    $scope.viewReviews = function () {
      //TBD
      console.log("Reviews Viewed");
    }
  }
})();