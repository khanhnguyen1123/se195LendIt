(function() { 
  angular
    .module('meanApp')
    .controller('searchForRentingItemController', searchForRentingItemController);
 	searchForRentingItemController.$inject = ['$location','$http','$scope','$window'];
    function searchForRentingItemController ($location,$http,$scope,$window) {      
      $scope.searchedItem = {};
      $scope.results = [];
      $scope.show=false;
      $scope.search = function(){
        console.log("inside click search funtion");
          $http.post('/api/lendingItem/search', $scope.searchedItem)
          .success(function(data){
            console.log(JSON.stringify(data));
            console.log(data.length);    
            $scope.results = data; 
            //$location.path('lending');  
            $window.alert("Searching result: "+JSON.stringify($scope.results));    
            if(data.length>0) $scope.show = true; 
            if(data.length==0) $scope.show = false;        
          })
          .error(function(error) {
                    console.log('Error: ' + error);
                    //$location.path('lending');
                });
      }; // end search function      
      
    }// end searchForRentingItemController

})();
                    