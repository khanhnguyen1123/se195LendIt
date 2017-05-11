(function() { 
	angular
	  .module('meanApp')
	  .controller('myItemController', myItemController);
	myItemController.$inject = ['$location','meanData','$http','$scope'];
	

   function myItemController ($location,meanData,$http,$scope) {
      $scope.user;

      $scope.rentTitle = "Rent Items";
      $scope.borrowTitle = "Borrow Items";
      $scope.requestTitle = "Requests Items";
      $scope.currentTitle = "Currently Renting";

      $scope.rentItems = [];
      $scope.borrowItems = [];
      $scope.requestedItems = [];
      $scope.currentItems = [];

      $scope.itemContainer = [true, true, true, true];
      $scope.titleClasses = ["glyphicon glyphicon-chevron-up", "glyphicon glyphicon-chevron-up", "glyphicon glyphicon-chevron-up", "glyphicon glyphicon-chevron-up"];

      var up = "glyphicon glyphicon-chevron-up";
      var down = "glyphicon glyphicon-chevron-down";

      $scope.updateContainer = function (index) {
         if ($scope.itemContainer[index]) {
            $scope.titleClasses[index] = down;
         } else
            $scope.titleClasses[index] = up;
         $scope.itemContainer[index] = !$scope.itemContainer[index];
      }

      function getRent() {
         $http.get('/api/rent/user/'+$scope.user._id)
            .success(function(data){
               //console.log("Rent Items");
               //console.log(JSON.stringify(data));
               $scope.rentItems = data;
            })
            .error(function(error){
               console.log("Error: " + error);
            });
      };

      function getBorrow() {
         $http.get('/api/borrow/user/'+$scope.user._id)
            .success(function(data){
               //console.log("Borrow Items");
               //console.log(JSON.stringify(data));
               $scope.borrowItems = data;
            })
            .error(function(error){
               console.log("Error: " + error);
            });
      }

      function getRequest() {
         $http.get('/api/request/user/'+$scope.user._id)
            .success(function(data){
               //console.log("Request Items");
               //console.log(JSON.stringify(data));
               $scope.requestedItems = data;
            })
            .error(function(error){
               console.log("Error: " + error);
            });
      }

      function getUsed() {
         console.log($scope.user.currentlyRenting);
         if ($scope.user && $scope.user.currentlyRenting != 'undefined') {
            $scope.currentItems = $scope.user.currentlyRenting;
         }
      }
      
      meanData.getProfile()
         .success(function(data) {
            $scope.user = data;
         })
         .error( function(error) {
            console.log(error)
         })
         .finally( function(data) {
            if ($scope.user) {
               getRent();
               getBorrow();
               getRequest();
               getUsed();
            }
         })
        
        
      
    }

})();