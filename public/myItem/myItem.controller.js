(function() { 
	angular
	.module('meanApp')
	.controller('myItemController', myItemController);
	myItemController.$inject = ['$location','meanData','$http','$scope'];
	function myItemController ($location,meanData,$http,$scope) {
		console.log("In myItemController");


      $scope.rentTitle = "No Rent Items Found";
      $scope.borrowTitle = "No Borrow Items Found";
      $scope.requestTitle = "No Requests Found";
      $scope.rentingTitle = "No Renting items at current"

      $scope.rentItems = [];
      $scope.borrowItems = [];
      $scope.requestedItems = [];

      $scope.vme = this;
      $scope.vme.user = {};

      meanData.getProfile()
        .success(function(data){
          $scope.vme.user = data;
          console.log('User id: '+ $scope.vme.user._id + ' of type:' + Object.prototype.toString.call($scope.vme.user._id));
          if(data.currentlyRenting.length > 0){
            $scope.rentingTitle = "Your Current Renting Items";
            console.log("insde curretn retning item");
          }
          
        })
        .then(function(){
          $http.get('/api/rent/user/'+$scope.vme.user._id)
            .success(function(data){
              //console.log("Rent Items");
              //console.log(JSON.stringify(data));
              $scope.rentItems = data;
            })
            .error(function(error){
              console.log("Error: " + error);
            })
            .then( function() {
              if ($scope.rentItems.length > 0)
                $scope.rentTitle = "Rent Items";
            });

          $http.get('/api/request/user/'+$scope.vme.user._id)
            .success(function(data){
              //console.log("Requested Items");
              //console.log(JSON.stringify(data));
              $scope.requestedItems = data;
            })
            .error(function(error){
              console.log("Error: " + error);
            })
            .then( function() {
              if ($scope.requestedItems.length > 0)
                $scope.requestTitle = "Requested Items";
            });

          $http.get('/api/borrow/user/'+$scope.vme.user._id)
            .success(function(data){
              //console.log("Borrow Items");
              //console.log(JSON.stringify(data));
              $scope.borrowItems = data;
            })
            .error(function(error){
              console.log("Error: " + error);
            })
            .then( function() {
              if ($scope.borrowItems.length > 0)
                $scope.borrowTitle = "Borrow Items";
            });
        })
      
    }

})();