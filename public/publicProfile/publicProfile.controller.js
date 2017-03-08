(function() {
  
  angular
    .module('meanApp')
    .controller('publicProfileController', publicProfileController);
  publicProfileController.$inject = ['$scope','$http','$stateParams', 'authentication'];

  function publicProfileController($scope,$http,$stateParams, authentication) {
    $scope.user = {};
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
      console.log("Message Sent");
    }

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