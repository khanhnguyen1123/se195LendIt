(function() { 
  angular
    .module('meanApp')
    .controller('rentItemController', rentItemController);
  rentItemController.$inject = ['$location','$http','$scope','$stateParams', '$window'];

  function rentItemController ($location, $http, $scope, $stateParams, $window) {
    $scope.rentItem = {};
    
    var id = $stateParams.random;
    $http.get('/api/lendingItem/get/'+id)
      .success(function(data){
        console.log(JSON.stringify(data));
        $scope.rentItem = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      });

    $scope.makePaypalPayment = function(){
      console.log("Paypal Payment Processing")
      $http.post('/create', $scope.rentItem)
        .success(function(data){
          console.log('Paypal Payment Success: '+JSON.stringify(data));   
          $window.location.href=data.link;
        })
        .error(function(data) {
          console.log('Paypal Payment Error: ' + data);
        });
    }; // end makePaypalPayment function
      
  }

})();