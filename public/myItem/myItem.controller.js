(function() { 
  angular
    .module('meanApp')
    .controller('myItemController', myItemController);
  myItemController.$inject = ['$location','meanData','$http','$scope'];
    function myItemController ($location,meanData,$http,$scope) {
      console.log("In myItemController");

      $scope.requestedItems = [];
      $scope.lendingItems = [];

      $scope.vme = this;
      $scope.vme.user = {};
      meanData.getProfile()
        .success(function(data){
          $scope.vme.user = data;
          console.log('User id: '+ $scope.vme.user._id + ' of type:' + Object.prototype.toString.call($scope.vme.user._id));
        })
        .then(function(){
          $http.post('/api/requestedItem/getUserItems', $scope.vme.user)
            .success(function(data){
              console.log(JSON.stringify(data));
              $scope.requestedItems = data;
            })
            .error(function(error){
              console.log("Error: " + error);
            });

            $http.post('/api/lendingItem/getUserItems', $scope.vme.user)
              .success(function(data){
                console.log(JSON.stringify(data));
                $scope.lendingItems = data;
              })
              .error(function(error){
              console.log("Error: " + error);
            });
        })
      
    }// end requestController

})();