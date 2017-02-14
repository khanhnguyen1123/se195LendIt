(function() { 
  angular
    .module('meanApp')
    .controller('lendingItemDetailController', lendingItemDetailController);
 	lendingItemDetailController.$inject = ['$location','$http','$scope','$stateParams','$window'];
    function lendingItemDetailController ($location,$http,$scope,$stateParams,$window) {
      console.log('khanh is inside detailController');
      $scope.lendingItem = {};
      //Retrieve a particular items to show in the detail page
      var id = $stateParams.random;
      console.log('khanh tesing passing id to detail controller :' + id);
      $http.get('/api/lendingItem/get/'+id)
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.lendingItem = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      // this function creat paypal payment ||
      // @parameters: price of item and item owner's paypal email
      // @return: ???? something to make sure for routing  
      
      $scope.paymentData = {
        currency: "USD",
        amount  : "5.00" ,
        description: " khanh testing paypal payment"
      }
      $scope.makePaypalPayment = function(){
        console.log("khanh pressinmg pay button");
        $http.post('/create', $scope.lendingItem)
          .success(function(data){
            console.log('khanh successfully inside make paypal payment scope '+JSON.stringify(data));   
            $window.location.href=data.link;
          })
          .error(function(data) {
                    console.log('Error fail calling makePaypalPayment: ' + data);
                });
      }; // end makePaypalPayment function

    }// end requestController

})();