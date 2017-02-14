(function() { 
  angular
    .module('meanApp')
    .controller('myItemController', myItemController);
 	myItemController.$inject = ['$location','$http','meanData','$scope','$state'];
    function myItemController ($location,$http,meanData,$scope,$state) {
      console.log('in myItemController');

      $scope.requestedItems = [];
      $scope.lendingItems = [];

      $scope.vme = this;
      $scope.vme.user = {};
      $scope.userdata={duc:"58a293fb1804137e32fb1cec"};
      meanData.getProfile()
        .success(function(data) {
          $scope.vme.user = data;
          id = data._id;
          console.log('User id: '+ $scope.vme.user._id);
        })
        .error(function (e) {
          console.log(e);
        }); 

        $http.get('/api/requestedItem/getUserItems', $scope.userdata)
          .success(function(data){
            console.log(JSON.stringify(data));
            $scope.requestedItems = data;
          })
          .error(function(error) {
            console.log('Error: ' + error);
          });

      //Retrieve all user's requested items to show the request page
      $scope.getUserRequestItems = function(){
        $http.get('/api/requestedItem/getUserItems', $scope.userdata)
          .success(function(data){
            console.log(JSON.stringify(data));
            $scope.requestedItems = data;
          })
          .error(function(error) {
            console.log('Error: ' + error);
          });
      };

      //Retrieve all user's lending items to show the request page
      $scope.getUserLendingItems = function(){
        $http.get('/api/lendingItem/getUserItems', $scope.vme.user)
          .success(function(data){
            console.log(JSON.stringify(data));
            $scope.lendingItems = data;
          })
          .error(function(error) {
            console.log('Error: ' + error);
          });
      };

    }// end requestController

})();