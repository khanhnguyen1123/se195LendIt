(function() { 
  angular
    .module('meanApp')
    .controller('rentController', rentController);
   rentController.$inject = ['$location','$http','$scope','authentication'];

    function rentController ($location,$http,$scope, authentication) {
      $scope.categories = ['All', 'Tools', 'Books', 'Movies, Music & Games', 'Electronics', 'Toys', 'Clothes', 'Sports & Outdoors', 'Private Properties', 'Others'];
      $scope.selectedCategory = $scope.categories[0];
      $scope.displayedItems = [];
      $scope.loggedIn = authentication.isLoggedIn();

      //Retrieve all the requested items to show the request page
      $http.get('/api/lendingItem/get')
        .success(function(data){
          //console.log(JSON.stringify(data));
          $scope.displayedItems = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });

      $scope.filter = function(category) {
        //console.log("Filtered Category: " + category);
        $scope.selectedCategory = category;
        if (category == "All") {
          $scope.displayedItems = $scope.rentItems;
          return;
        }
        $http.get()

        $http.get('/api/lendingItemCategory/get/'+category)
        .success(function(data){
          console.log(JSON.stringify(data));
          $scope.requestedItems = data;
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
      

        $scope.displayedItems = [];
        for (let i = 0; i < $scope.rentItems.length; i++) { 
          let item = $scope.rentItems[i];
          if (item.category == category)
            $scope.displayedItems.push(item);
        }
      }


      
    }// end requestController

})();