(function() { 
   angular
      .module('meanApp')
      .controller('requestItemController', requestItemController);
   requestItemController.$inject = ['$location','$http','$scope','$stateParams', 'authentication', 'meanData'];

   function requestItemController ($location,$http,$scope,$stateParams, authentication, meanData) {
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.requestedItem = {};
      $scope.user = {};
      $scope.owner = false;
      //Retrieve a particular items to show in the detail page
      let id = $stateParams.random;
      $http.get('/api/requestedItem/get/'+id)
         .success(function(data){
            console.log(JSON.stringify(data));
            $scope.requestedItem = data;
         })
         .error(function(error) {
            console.log('Error: ' + error);
         });
      if (authentication.isLoggedIn()) {
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
            })
            .error(function (e) {
               console.log(e);
            }); 
         if ($scope.user._id == $scope.requestedItem.ownerId) 
            $scope.owner = true;
      }
      $scope.updateRequest = function () {
         console.log("Saved Request")
      }
   }
})();
                    