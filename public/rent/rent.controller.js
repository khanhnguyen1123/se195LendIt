(function() { 
  angular
    .module('meanApp')
    .controller('rentController', rentController);
   rentController.$inject = ['$location','$http','$scope','authentication'];

    function rentController ($location,$http,$scope, authentication) {
      $scope.categories = ['All', 'Books & Audible', 'Movies, Music & Games', 'Electronics & Games', 'Home & Garden','Beauty, Health & Grocery', 'Toys, Kids & Baby', 'Clothing, Shoes, & Jewelry', 'Handmade', 'Sports & Outdoors', 'Autmotive & Industrial', 'Private Parking', 'Others'];
      $scope.selectedCategory = $scope.categories[0];
      $scope.displayedItems = [];
      $scope.rentItems = [];
      $scope.loggedIn = authentication.isLoggedIn();

      //Retrieve all the requested items to show the request page
      $http.get('/api/lendingItem/get')
        .success(function(data){
          //console.log(JSON.stringify(data));
          $scope.rentItems = data;
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

        $scope.displayedItems = [];
        for (let i = 0; i < $scope.rentItems.length; i++) { 
          let item = $scope.rentItems[i];
          if (item.category == category)
            $scope.displayedItems.push(item);
        }
      }


      
    }// end requestController

})();